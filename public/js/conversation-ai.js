/**
 * Conversation AI Chat - HTTP API based chat for AI conversations
 */

function initAIChat(config) {
  const { conversationId, currentUserId, currentUserAvatar, GEMINI_AI_USER_ID } = config;
  
  const messagesContainer = document.getElementById('messagesContainer');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const typingIndicator = document.getElementById('typingIndicator');
  
  if (!messagesContainer || !messageForm || !messageInput || !sendButton) {
    console.error('Required DOM elements not found');
    return;
  }

  // Scroll to bottom
  function scrollToBottom() {
    if (messagesContainer) {
      requestAnimationFrame(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
    }
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Format markdown/HTML for AI messages
  function formatAIMessage(text) {
    if (!text) return '';
    
    // First escape HTML to prevent XSS, then convert markdown
    let formatted = escapeHtml(text);
    
    // Bold: **text** or __text__
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Italic: *text* (but not if it's part of **text** or at start of line for lists)
    // Match *text* but not **text** or * at start of line
    formatted = formatted.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
    
    // Code: `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    
    // Line breaks: \n -> <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    // List items: * item or - item (at start of line)
    formatted = formatted.replace(/^[\*\-\+]\s+(.+)$/gm, '<li class="ml-4">$1</li>');
    // Wrap consecutive list items in <ul>
    formatted = formatted.replace(/(<li class="ml-4">.*?<\/li>(?:\s*<li class="ml-4">.*?<\/li>)*)/g, '<ul class="list-disc list-inside my-2 space-y-1">$1</ul>');
    
    return formatted;
  }
  
  // Format existing AI messages on page load
  function formatExistingAIMessages() {
    const aiMessages = messagesContainer.querySelectorAll('.ai-message-content');
    aiMessages.forEach(element => {
      const originalText = element.textContent || element.innerText;
      element.innerHTML = formatAIMessage(originalText);
    });
  }

  // Show/hide typing indicator
  function showAITypingIndicator() {
    if (typingIndicator && messagesContainer) {
      // Move typing indicator to the end of messages container
      typingIndicator.remove();
      messagesContainer.appendChild(typingIndicator);
      typingIndicator.classList.remove('hidden');
      scrollToBottom();
    }
  }

  function hideAITypingIndicator() {
    if (typingIndicator) {
      typingIndicator.classList.add('hidden');
    }
  }

  // Add message to UI
  function addMessage(message, isCurrentUser) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`;
    
    let time = 'Vừa xong';
    if (message.createdAt || message.created_at) {
      try {
        const dateValue = message.createdAt || message.created_at;
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }
    }
    
    let avatarHtml = '';
    if (!isCurrentUser) {
      // AI avatar
      avatarHtml = `
        <div class="flex-shrink-0">
          <img src="/images/Logo_AI.png" alt="StudyMate AI" class="h-8 w-8 rounded-full object-cover">
        </div>
      `;
    }
    
    let currentUserAvatarHtml = '';
    if (isCurrentUser) {
      const userAvatar = message.sender?.avatar || currentUserAvatar || '';
      currentUserAvatarHtml = `
        <div class="flex-shrink-0">
          ${userAvatar 
            ? `<img src="${escapeHtml(userAvatar)}" alt="Bạn" class="h-8 w-8 rounded-full">`
            : `<div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span class="text-white text-xs font-semibold">Bạn</span>
              </div>`
          }
        </div>
      `;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`;
    
    // Format message content: escape for user messages, format markdown for AI messages
    const messageContent = isCurrentUser 
      ? escapeHtml(message.content) 
      : formatAIMessage(message.content);
    
    messageDiv.innerHTML = `
      ${avatarHtml}
      <div class="${isCurrentUser ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2 max-w-[70%]">
        <div class="text-sm ${isCurrentUser ? 'text-white' : 'text-gray-900'}">${messageContent}</div>
        <p class="text-xs mt-1 ${isCurrentUser ? 'text-primary-100' : 'text-gray-500'}">${time}</p>
      </div>
      ${currentUserAvatarHtml}
    `;
    
    messageWrapper.appendChild(messageDiv);
    messageWrapper.setAttribute('data-message-id', message.id);
    
    // If typing indicator is visible, insert before it, otherwise append to end
    if (typingIndicator && !typingIndicator.classList.contains('hidden')) {
      messagesContainer.insertBefore(messageWrapper, typingIndicator);
    } else {
      messagesContainer.appendChild(messageWrapper);
    }
    scrollToBottom();
  }

  // Fetch and display AI messages
  async function fetchAndDisplayAIMessages() {
    try {
      const response = await fetch(`/chat/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.messages) {
        const messages = data.data.messages;
        
        // Get existing message IDs to avoid duplicates
        const existingIds = new Set();
        messagesContainer.querySelectorAll('[data-message-id]').forEach(el => {
          existingIds.add(el.getAttribute('data-message-id'));
        });

        // Add new messages
        messages.forEach(message => {
          if (!existingIds.has(message.id)) {
            const isCurrentUser = message.sender_id === currentUserId;
            addMessage({
              ...message,
              createdAt: message.created_at
            }, isCurrentUser);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching AI messages:', error);
    }
  }

  // Message form handler
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = messageInput.value.trim();
    if (!content) return;
    
    // Disable input and show loading state
    messageInput.disabled = true;
    sendButton.disabled = true;
    
    // Store original button content
    const originalButtonContent = sendButton.innerHTML;
    sendButton.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Đang gửi...</span>
    `;
    
    // Optimistic UI: Add user message immediately
    const tempMessageId = 'temp-' + Date.now();
    addMessage({
      id: tempMessageId,
      content: content,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sender: {
        avatar: currentUserAvatar
      }
    }, true);
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    showAITypingIndicator();
    
    try {
      // Send message via HTTP API
      const response = await fetch(`/chat/${conversationId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          content: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Hide typing indicator
      hideAITypingIndicator();
      
      // Remove temporary message
      const tempMessage = document.querySelector(`[data-message-id="${tempMessageId}"]`);
      if (tempMessage) {
        tempMessage.remove();
      }
      
      // Fetch and display new messages (including AI response)
      setTimeout(() => {
        fetchAndDisplayAIMessages();
      }, 500);
      
      // Re-enable input and restore button
      messageInput.disabled = false;
      sendButton.disabled = false;
      sendButton.innerHTML = originalButtonContent;
      messageInput.focus();
    } catch (error) {
      console.error('Send message error:', error);
      hideAITypingIndicator();
      
      // Remove temporary message on error
      const tempMessage = document.querySelector(`[data-message-id="${tempMessageId}"]`);
      if (tempMessage) {
        tempMessage.remove();
      }
      
      alert('Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.');
      messageInput.disabled = false;
      sendButton.disabled = false;
      sendButton.innerHTML = originalButtonContent;
      messageInput.focus();
    }
  });

  // Initial scroll
  function initScroll() {
    if (!messagesContainer) return;
    const forceScroll = () => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    forceScroll();
    setTimeout(forceScroll, 50);
    setTimeout(forceScroll, 200);
    setTimeout(forceScroll, 500);
  }

  // Check for selected text from learn page
  function checkForSelectedText() {
    const selectedText = sessionStorage.getItem('aiChatSelectedText');
    if (selectedText && selectedText.trim()) {
      // Pre-fill input with selected text
      messageInput.value = selectedText.trim();
      // Clear from storage
      sessionStorage.removeItem('aiChatSelectedText');
      // Focus input
      messageInput.focus();
      // Optionally show a hint
      if (messageInput.placeholder) {
        const originalPlaceholder = messageInput.placeholder;
        messageInput.placeholder = 'Đã chọn: ' + (selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText);
        setTimeout(() => {
          messageInput.placeholder = originalPlaceholder;
        }, 3000);
      }
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      formatExistingAIMessages();
      checkForSelectedText();
      setTimeout(initScroll, 50);
    });
  } else {
    formatExistingAIMessages();
    checkForSelectedText();
    setTimeout(initScroll, 50);
  }

  window.addEventListener('load', () => {
    formatExistingAIMessages();
    checkForSelectedText();
    setTimeout(initScroll, 100);
  });
}

