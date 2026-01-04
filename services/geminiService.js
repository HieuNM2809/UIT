const https = require('https');
const { applicationLogger } = require('../config/logger');

/**
 * Get Gemini models list from environment variable
 * Format: comma-separated string, e.g., "gemini-3-flash,gemini-2.5-flash,gemma-3-27b-it"
 * Falls back to default list if not set
 */
function getGeminiModels() {
  const envModels = process.env.GEMINI_MODELS;
  
  if (envModels && envModels.trim()) {
    return envModels.split(',').map(m => m.trim()).filter(m => m.length > 0);
  }
  
  // Default models list
  return [
    'gemma-3-27b-it',
    'gemma-3-12b-it',
    'gemma-3-4b-it',
    'gemma-3-2b-it',
    'gemma-3-1b-it',
    'gemini-3-flash',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash-tts',
    'gemini-2.5-flash-native-audio-dialog',
    'gemini-robotics-er-1.5-preview'
  ];
}

/**
 * Call Gemini API with automatic fallback to multiple models
 * @param {string} message - The message to send
 * @param {Array} conversationHistory - Optional conversation history
 * @returns {Promise<{response: string, model: string, modelsTried: Array}>}
 */
exports.callGeminiWithFallback = async (message, conversationHistory = []) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình');
  }

  const { metrics } = require('../middleware/metrics');
  const startTime = Date.now();
  const models = getGeminiModels();
  let lastError = null;
  let successfulModel = null;
  let response = null;
  const modelsTried = [];

  // Try each model in order
  for (const model of models) {
    try {
      modelsTried.push(model);
      
      applicationLogger.info(`Trying Gemini model: ${model}`, {
        type: 'gemini',
        operation: 'call_with_fallback',
        model: model,
        messageLength: message.length,
        conversationHistoryLength: conversationHistory?.length || 0
      });

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
      
      // Build contents array with conversation history
      const contents = [];
      
      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          contents.push({
            role: msg.role || 'user',
            parts: [{ text: msg.content || msg.text }]
          });
        });
      }
      
      // Add current message
      contents.push({
        parts: [{ text: message }]
      });
      
      const requestData = JSON.stringify({ contents });
      
      // Log request (without API key)
      applicationLogger.debug(`Gemini API Request - Model: ${model}`, {
        type: 'gemini',
        operation: 'api_request',
        model: model,
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=***`,
        requestBody: {
          contents: contents.map(c => ({
            role: c.role,
            parts: c.parts.map(p => ({
              text: p.text ? (p.text.length > 2000 ? p.text.substring(0, 2000) + '...' : p.text) : '[no text]'
            }))
          }))
        },
        requestBodySize: Buffer.byteLength(requestData)
      });

      // Make API call using native https module
      const result = await new Promise((resolve, reject) => {
        const url = new URL(apiUrl);
        const options = {
          hostname: url.hostname,
          port: 443,
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData)
          }
        };

        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            // Log response
            const responseSize = Buffer.byteLength(data);
            let responseDataForLog = null;
            
            try {
              const parsedData = JSON.parse(data);
              responseDataForLog = {
                statusCode: res.statusCode,
                hasCandidates: !!parsedData.candidates,
                candidatesCount: parsedData.candidates?.length || 0,
                responseText: parsedData.candidates?.[0]?.content?.parts?.[0]?.text 
                  ? (parsedData.candidates[0].content.parts[0].text.length > 500 
                      ? parsedData.candidates[0].content.parts[0].text.substring(0, 500) + '...' 
                      : parsedData.candidates[0].content.parts[0].text)
                  : null,
                error: parsedData.error || null
              };
            } catch (e) {
              responseDataForLog = {
                statusCode: res.statusCode,
                rawResponse: data.length > 2000 ? data.substring(0, 2000) + '...' : data
              };
            }
            
            applicationLogger.debug(`Gemini API Response - Model: ${model}`, {
              type: 'gemini',
              operation: 'api_response',
              model: model,
              statusCode: res.statusCode,
              responseSize: responseSize,
              responseData: responseDataForLog
            });
            
            if (res.statusCode === 200) {
              try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
              } catch (parseError) {
                applicationLogger.error(`Failed to parse Gemini response`, parseError, {
                  type: 'gemini',
                  operation: 'parse_error',
                  model: model,
                  statusCode: res.statusCode,
                  rawResponse: data.length > 2000 ? data.substring(0, 2000) + '...' : data
                });
                reject(new Error(`Failed to parse response: ${parseError.message}`));
              }
            } else {
              applicationLogger.error(`Gemini API returned error status`, new Error(`Status ${res.statusCode}`), {
                type: 'gemini',
                operation: 'api_error',
                model: model,
                statusCode: res.statusCode,
                responseBody: data.length > 2000 ? data.substring(0, 2000) + '...' : data
              });
              reject(new Error(`API returned status ${res.statusCode}: ${data}`));
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(requestData);
        req.end();
      });

      // Extract response text
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const content = result.candidates[0].content;
        if (content.parts && content.parts[0] && content.parts[0].text) {
          response = content.parts[0].text;
          successfulModel = model;
          
          applicationLogger.info(`Gemini model ${model} succeeded`, {
            type: 'gemini',
            operation: 'call_success',
            model: model,
            responseLength: response.length
          });
          
          break; // Success, exit loop
        }
      }

      // If no text found in response
      throw new Error('No text found in response');

    } catch (error) {
      lastError = error;
      applicationLogger.warn(`Gemini model ${model} failed`, {
        type: 'gemini',
        operation: 'call_failed',
        model: model,
        error: error.message
      });
      
      // Continue to next model
      continue;
    }
  }

  // Check if any model succeeded
  const duration = (Date.now() - startTime) / 1000;
  
  if (!response || !successfulModel) {
    // Record failed metrics
    metrics.recordAIRequest('gemini', 'chat_with_fallback', duration, 'error');
    
    applicationLogger.error('All Gemini models failed', lastError, {
      type: 'gemini',
      operation: 'all_models_failed',
      modelsTried: modelsTried.length
    });

    throw new Error(`Tất cả các models đều thất bại. Lỗi cuối cùng: ${lastError?.message || 'Unknown error'}`);
  }

  // Record successful metrics
  metrics.recordAIRequest('gemini', 'chat_with_fallback', duration, 'success');
  // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
  const estimatedTokens = Math.ceil(message.length / 4);
  const estimatedResponseTokens = Math.ceil(response.length / 4);
  if (estimatedTokens > 0 || estimatedResponseTokens > 0) {
    metrics.recordAITokens('gemini', estimatedTokens, estimatedResponseTokens);
  }

  return {
    response,
    model: successfulModel,
    modelsTried
  };
};

/**
 * Get available Gemini models list
 */
exports.getGeminiModels = getGeminiModels;

