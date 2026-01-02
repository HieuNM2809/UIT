const https = require('https');
const { applicationLogger } = require('../config/logger');

/**
 * VietQR Service
 * Tích hợp VietQR API để tạo QR code thanh toán
 * 
 * Documentation: https://www.vietqr.io/
 */

class VietQRService {
  constructor() {
    this.apiKey = process.env.VIETQR_API_KEY;
    this.clientId = process.env.VIETQR_CLIENT_ID;
    this.apiSecret = process.env.VIETQR_API_SECRET;
    this.baseUrl = process.env.VIETQR_BASE_URL || 'https://api.vietqr.io';
    this.enabled = !!(this.apiKey && this.clientId && this.apiSecret);
  }

  /**
   * Tạo QR code thanh toán
   * @param {Object} params - Thông tin thanh toán
   * @param {number} params.amount - Số tiền
   * @param {string} params.description - Mô tả thanh toán
   * @param {string} params.orderId - Mã đơn hàng (enrollment_id)
   * @param {string} params.accountNo - Số tài khoản ngân hàng
   * @param {string} params.accountName - Tên chủ tài khoản
   * @param {string} params.bankCode - Mã ngân hàng (VCB, TCB, etc.)
   * @returns {Promise<Object>} QR code data
   */
  async createQRCode(params) {
    if (!this.enabled) {
      throw new Error('VietQR service is not enabled. Please configure VIETQR_API_KEY, VIETQR_CLIENT_ID, and VIETQR_API_SECRET');
    }

    const { amount, description, orderId, accountNo, accountName, bankCode } = params;

    const requestData = {
      accountNo: accountNo || process.env.VIETQR_ACCOUNT_NO,
      accountName: accountName || process.env.VIETQR_ACCOUNT_NAME || 'StudyMate',
      acqId: bankCode || process.env.VIETQR_BANK_CODE || '970415', // Default: Vietcombank
      amount: Math.round(amount), // Amount in VND
      addInfo: description || `Thanh toan khoa hoc - ${orderId}`,
      format: 'text',
      template: 'compact2'
    };

    try {
      applicationLogger.info('Creating VietQR payment QR code', {
        type: 'payment',
        operation: 'vietqr_create',
        orderId: orderId,
        amount: amount
      });

      const result = await this.makeRequest('/v2/generate', 'POST', requestData);

      if (result.code === '00' && result.data) {
        applicationLogger.info('VietQR QR code created successfully', {
          type: 'payment',
          operation: 'vietqr_success',
          orderId: orderId,
          qrCode: result.data.qrDataURL ? 'generated' : null
        });

        return {
          success: true,
          qrCode: result.data.qrDataURL || result.data.qrCode,
          qrData: result.data.qrCode,
          qrDataURL: result.data.qrDataURL,
          deepLink: result.data.deeplink,
          transactionId: result.data.transactionId || orderId
        };
      } else {
        throw new Error(result.desc || 'Failed to create QR code');
      }
    } catch (error) {
      applicationLogger.error('VietQR create QR code error', error, {
        type: 'payment',
        operation: 'vietqr_error',
        orderId: orderId,
        amount: amount
      });
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   * @param {string} transactionId - Mã giao dịch
   * @returns {Promise<Object>} Payment status
   * @note VietQR API không hỗ trợ check status endpoint, chỉ dùng callback
   */
  async checkPaymentStatus(transactionId) {
    if (!this.enabled) {
      throw new Error('VietQR service is not enabled');
    }

    // VietQR API không có endpoint để check status
    // Chỉ có thể check qua callback webhook
    // Return pending status as default
    applicationLogger.warn('VietQR check payment status - endpoint not available, using callback only', {
      type: 'payment',
      operation: 'vietqr_check_status_not_available',
      transactionId: transactionId
    });

    return {
      success: true,
      status: 'pending',
      transactionId: transactionId,
      message: 'Status check not available, waiting for callback'
    };
  }

  /**
   * Make HTTP request to VietQR API
   * @private
   */
  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'x-client-id': this.clientId,
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      };

      // Add API secret to headers if provided
      if (this.apiSecret) {
        options.headers['x-api-secret'] = this.apiSecret;
      }

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(responseData);
            
            if (res.statusCode === 200) {
              resolve(jsonData);
            } else {
              reject(new Error(`API returned status ${res.statusCode}: ${responseData}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data && method === 'POST') {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }
}

// Export singleton instance
module.exports = new VietQRService();

