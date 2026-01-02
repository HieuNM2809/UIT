/**
 * Conversation User Chat - Socket.IO based chat for user-to-user conversations
 */

function initUserChat(config) {
  const { conversationId, currentUserId, currentUserAvatar } = config;
  
  const messagesContainer = document.getElementById('messagesContainer');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  
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
      const senderName = message.sender?.name || (message.sender?.first_name && message.sender?.last_name ? `${message.sender.first_name} ${message.sender.last_name}` : 'User');
      const senderInitials = senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const senderAvatar = message.sender?.avatar || '';
      
      avatarHtml = `
        <div class="flex-shrink-0">
          ${senderAvatar 
            ? `<img src="${escapeHtml(senderAvatar)}" alt="${escapeHtml(senderName)}" class="h-8 w-8 rounded-full">`
            : `<div class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
                <span class="text-white text-xs font-semibold">${escapeHtml(senderInitials)}</span>
              </div>`
          }
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
    
    // Read status indicator
    let readStatusHtml = '';
    if (isCurrentUser) {
      const isRead = message.is_read || false;
      readStatusHtml = `
        <div class="read-status mt-1 mr-2" data-message-id="${message.id}">
          ${isRead 
            ? `<div class="inline-flex items-center space-x-1 bg-gray-500 rounded-full px-2 py-0.5">
                 <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                 </svg>
                 <span class="text-xs text-white">Đã đọc</span>
               </div>`
            : `<div class="inline-flex items-center space-x-1 bg-gray-500 rounded-full px-2 py-0.5">
                 <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                 </svg>
                 <span class="text-xs text-white">Đã gửi</span>
               </div>`
          }
        </div>
      `;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`;
    
    messageDiv.innerHTML = `
      ${avatarHtml}
      <div class="${isCurrentUser ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2 max-w-[70%]">
        <p class="text-sm">${escapeHtml(message.content)}</p>
        <p class="text-xs mt-1 ${isCurrentUser ? 'text-primary-100' : 'text-gray-500'}">${time}</p>
      </div>
      ${currentUserAvatarHtml}
    `;
    
    messageWrapper.appendChild(messageDiv);
    if (readStatusHtml) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = readStatusHtml;
      messageWrapper.appendChild(tempDiv.firstElementChild);
    }
    
    messageWrapper.setAttribute('data-message-id', message.id);
    messagesContainer.appendChild(messageWrapper);
    scrollToBottom();
  }

  // Show message alert
  function showMessageAlert(message, senderName) {
    const isPageVisible = !document.hidden;
    
    if (!isPageVisible && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(`Tin nhắn mới từ ${senderName}`, {
          body: message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content,
          icon: message.sender?.avatar || '/images/Logo.png',
          tag: `message-${message.id}`,
          requireInteraction: false
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        
        setTimeout(() => notification.close(), 5000);
      } catch (error) {
        console.error('Notification error:', error);
      }
    }
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50 transform transition-all duration-300 ease-out';
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    
    const senderAvatar = message.sender?.avatar || '';
    const senderInitials = senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          ${senderAvatar 
            ? `<img src="${escapeHtml(senderAvatar)}" alt="${escapeHtml(senderName)}" class="h-10 w-10 rounded-full">`
            : `<div class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                <span class="text-white text-xs font-semibold">${escapeHtml(senderInitials)}</span>
              </div>`
          }
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900">${escapeHtml(senderName)}</p>
          <p class="text-sm text-gray-600 mt-1 line-clamp-2">${escapeHtml(message.content)}</p>
        </div>
        <button onclick="this.closest('.message-toast').remove()" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    
    toast.classList.add('message-toast');
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }

  // Initialize Socket.IO
  let socket;
  let hasJoinedConversation = false;
  let typingTimeout = null;
  let isTyping = false;
  let localTypingTimeout;

  function initSocket() {
    if (typeof io === 'undefined') {
      console.error('Socket.IO library not loaded. Retrying...');
      setTimeout(initSocket, 100);
      return;
    }
    
    socket = io({
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO');
      socket.emit('join_conversation', conversationId);
      socket.emit('mark_read', conversationId);
      hasJoinedConversation = true;
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO');
      hasJoinedConversation = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('new_message', (message) => {
      if (!message.createdAt && message.created_at) {
        message.createdAt = message.created_at;
      }
      const isCurrentUser = message.sender_id === currentUserId;
      
      const existingMessage = document.querySelector(`[data-message-id="${message.id}"]`);
      if (!existingMessage) {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
          typingIndicator.classList.add('hidden');
          isTyping = false;
          if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
          }
        }
        
        addMessage(message, isCurrentUser);
        
        if (!isCurrentUser) {
          const senderName = message.sender?.first_name && message.sender?.last_name 
            ? `${message.sender.first_name} ${message.sender.last_name}`
            : 'Người dùng';
          showMessageAlert(message, senderName);
        }
      }
    });

    socket.on('messages_read', (data) => {
      const { conversationId: readConversationId, readBy } = data;
      
      if (readConversationId === conversationId && readBy && readBy !== currentUserId) {
        const messageWrappers = messagesContainer.querySelectorAll('.flex.flex-col.items-end[data-message-id]');
        
        messageWrappers.forEach(wrapper => {
          const readStatusElement = wrapper.querySelector('.read-status');
          if (readStatusElement) {
            const currentText = readStatusElement.textContent.trim();
            if (currentText.includes('Đã gửi')) {
              readStatusElement.innerHTML = `
                <div class="inline-flex items-center space-x-1 bg-gray-500 rounded-full px-2 py-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-xs text-white">Đã đọc</span>
                </div>
              `;
            }
          }
        });
      }
    });

    socket.on('user_typing', (data) => {
      const typingIndicator = document.getElementById('typingIndicator');
      if (!typingIndicator) return;
      
      if (data.userId !== currentUserId) {
        if (data.isTyping) {
          typingIndicator.classList.remove('hidden');
          isTyping = true;
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          typingTimeout = setTimeout(() => {
            typingIndicator.classList.add('hidden');
            isTyping = false;
            typingTimeout = null;
          }, 3000);
        } else {
          typingIndicator.classList.add('hidden');
          isTyping = false;
          if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
          }
        }
      }
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      if (error.message) {
        alert(error.message);
      }
    });
  }

  // Message form handler
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = messageInput.value.trim();
    if (!content) return;
    
    if (!socket || !socket.connected || !hasJoinedConversation) {
      alert('Đang kết nối... Vui lòng thử lại sau.');
      return;
    }
    
    messageInput.disabled = true;
    sendButton.disabled = true;
    
    try {
      socket.emit('send_message', {
        conversationId: conversationId,
        content: content
      });
      
      messageInput.value = '';
      messageInput.disabled = false;
      sendButton.disabled = false;
      messageInput.focus();
    } catch (error) {
      console.error('Send message error:', error);
      alert('Đã xảy ra lỗi khi gửi tin nhắn');
      messageInput.disabled = false;
      sendButton.disabled = false;
      messageInput.focus();
    }
  });

  // Typing indicator
  messageInput.addEventListener('input', () => {
    if (socket && socket.connected && hasJoinedConversation) {
      socket.emit('typing', { conversationId: conversationId });
      
      if (localTypingTimeout) {
        clearTimeout(localTypingTimeout);
      }
      
      localTypingTimeout = setTimeout(() => {
        socket.emit('stop_typing', { conversationId: conversationId });
      }, 2000);
    }
  });

  messageForm.addEventListener('submit', () => {
    if (localTypingTimeout) {
      clearTimeout(localTypingTimeout);
      localTypingTimeout = null;
    }
    if (socket && socket.connected && hasJoinedConversation) {
      socket.emit('stop_typing', { conversationId: conversationId });
    }
  });

  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Mark as read on focus
  window.addEventListener('focus', () => {
    if (socket && socket.connected && hasJoinedConversation) {
      socket.emit('mark_read', conversationId);
    }
  });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (socket && socket.connected) {
      socket.emit('leave_conversation', conversationId);
      socket.disconnect();
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

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSocket();
      setTimeout(initScroll, 50);
    });
  } else {
    initSocket();
    setTimeout(initScroll, 50);
  }

  window.addEventListener('load', () => {
    setTimeout(initScroll, 100);
  });
}

