/**
 * StudyMate Frontend JavaScript
 * Main application scripts
 */

// Global app object
window.StudyMate = {
  version: '1.0.0',
  user: null,
  notifications: [],
  settings: {
    theme: 'light',
    language: 'vi',
    aiEnabled: true
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎓 StudyMate v' + StudyMate.version + ' initialized');
  
  // Initialize components
  initNotifications();
  initFormValidation();
  initProgressBars();
  initTooltips();
  initModals();
  
  // Add fade-in animation to elements
  const elements = document.querySelectorAll('[data-animate="fade-in"]');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('fade-in');
    }, index * 100);
  });
});

/**
 * Notification System
 */
function initNotifications() {
  // Auto-hide flash messages after 5 seconds
  const flashMessages = document.querySelectorAll('[role="alert"]');
  flashMessages.forEach(message => {
    const closeBtn = message.querySelector('button');
    if (closeBtn) {
      setTimeout(() => {
        message.remove();
      }, 5000);
    }
  });
}

function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type} p-4 rounded-lg shadow-lg mb-4`;
  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  if (duration > 0) {
    setTimeout(() => {
      notification.remove();
    }, duration);
  }
}

/**
 * Form Validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'Trường này là bắt buộc');
      isValid = false;
    } else {
      clearFieldError(input);
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        showFieldError(input, 'Email không hợp lệ');
        isValid = false;
      }
    }
    
    // Password confirmation
    if (input.name === 'confirm_password') {
      const password = form.querySelector('input[name="password"]');
      if (password && input.value !== password.value) {
        showFieldError(input, 'Mật khẩu xác nhận không khớp');
        isValid = false;
      }
    }
  });
  
  return isValid;
}

function showFieldError(input, message) {
  input.classList.add('error', 'border-red-500');
  
  let errorDiv = input.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains('error-message')) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-xs mt-1';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
  }
  errorDiv.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('error', 'border-red-500');
  
  const errorDiv = input.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.remove();
  }
}

/**
 * Progress Bars Animation
 */
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        const percentage = fill.dataset.percentage || 0;
        setTimeout(() => {
          fill.style.width = percentage + '%';
        }, 200);
      }
    });
  });
  
  progressBars.forEach(bar => observer.observe(bar));
}

/**
 * Tooltips
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const element = e.target;
  const text = element.dataset.tooltip;
  
  if (!text) return;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip absolute z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg';
  tooltip.textContent = text;
  tooltip.id = 'tooltip';
  
  document.body.appendChild(tooltip);
  
  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

/**
 * Modal System
 */
function initModals() {
  // Close modal when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId = null) {
  if (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  } else {
    // Close all modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.add('hidden'));
  }
  document.body.style.overflow = 'auto';
}

/**
 * API Helper Functions
 */
const API = {
  baseURL: '/api',
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

/**
 * Course Functions
 */
function enrollInCourse(courseId) {
  if (!confirm('Bạn có muốn đăng ký khóa học này không?')) {
    return;
  }
  
  API.post(`/courses/${courseId}/enroll`)
    .then(data => {
      if (data.success) {
        showNotification('Đăng ký khóa học thành công!', 'success');
        // Refresh page or update UI
        setTimeout(() => location.reload(), 1000);
      }
    })
    .catch(error => {
      showNotification('Lỗi khi đăng ký khóa học: ' + error.message, 'error');
    });
}

function markContentComplete(contentId) {
  API.post(`/content/${contentId}/complete`)
    .then(data => {
      if (data.success) {
        showNotification('Đã hoàn thành nội dung!', 'success');
        updateProgressUI();
      }
    })
    .catch(error => {
      showNotification('Lỗi khi cập nhật tiến độ: ' + error.message, 'error');
    });
}

function updateProgressUI() {
  // Update progress bars and stats
  const progressBars = document.querySelectorAll('.progress-fill[data-content-id]');
  progressBars.forEach(bar => {
    // Logic to update progress
  });
}

/**
 * Search Functionality
 */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          performSearch(query);
        }, 300);
      }
    });
  }
}

async function performSearch(query) {
  try {
    const results = await API.get(`/search?q=${encodeURIComponent(query)}`);
    displaySearchResults(results.data);
  } catch (error) {
    console.error('Search error:', error);
  }
}

function displaySearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (results.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">Không tìm thấy kết quả</p>';
    return;
  }
  
  results.forEach(result => {
    const item = document.createElement('div');
    item.className = 'search-result-item p-3 hover:bg-gray-50 border-b';
    item.innerHTML = `
      <h4 class="font-medium">${result.title}</h4>
      <p class="text-sm text-gray-600">${result.description || ''}</p>
      <a href="${result.url}" class="text-blue-600 text-sm">Xem chi tiết</a>
    `;
    container.appendChild(item);
  });
}

/**
 * Theme Management
 */
function toggleTheme() {
  const currentTheme = StudyMate.settings.theme;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  StudyMate.settings.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Save to localStorage
  localStorage.setItem('studymate-theme', newTheme);
}

// Load theme on page load
(function loadTheme() {
  const savedTheme = localStorage.getItem('studymate-theme') || 'light';
  StudyMate.settings.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

/**
 * Utility Functions
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Đã sao chép vào clipboard!', 'info', 2000);
  }).catch(() => {
    showNotification('Không thể sao chép!', 'error', 2000);
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions to global scope
window.StudyMate.showNotification = showNotification;
window.StudyMate.openModal = openModal;
window.StudyMate.closeModal = closeModal;
window.StudyMate.API = API;
window.StudyMate.enrollInCourse = enrollInCourse;
window.StudyMate.toggleTheme = toggleTheme;

console.log('✅ StudyMate JavaScript loaded successfully');

