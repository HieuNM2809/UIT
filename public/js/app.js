/**
 * StudyMate Frontend - Optimized & Responsive
 */

// Global app object
window.StudyMate = {
  version: '2.0.0',
  settings: {
    theme: localStorage.getItem('studymate-theme') || 'light'
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎓 StudyMate v' + StudyMate.version + ' initialized');
  
  // Initialize essential components only
  initNotifications();
  initFormValidation();
  initProgressBars();
  loadTheme();
  
  // Add entrance animations with intersection observer
  observeAnimations();
});

/**
 * Notification System - Simplified
 */
function initNotifications() {
  // Auto-hide flash messages
  const flashMessages = document.querySelectorAll('[role="alert"]');
  flashMessages.forEach(message => {
    setTimeout(() => {
      if (message.parentNode) message.remove();
    }, 4000);
  });
}

function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type} p-3 sm:p-4 rounded-lg shadow-lg mb-2 text-sm sm:text-base`;
  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="flex-1 mr-2">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" 
              class="text-current hover:opacity-70 touch-target flex-shrink-0">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  if (duration > 0) {
    setTimeout(() => notification.remove(), duration);
  }
}

/**
 * Form Validation - Essential only
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
    
    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => clearFieldError(input));
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  inputs.forEach(input => {
    const value = input.value.trim();
    
    if (!value) {
      showFieldError(input, 'Trường này là bắt buộc');
      isValid = false;
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showFieldError(input, 'Email không hợp lệ');
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });
  
  return isValid;
}

function showFieldError(input, message) {
  input.classList.add('border-red-500');
  
  let errorDiv = input.parentNode.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-xs mt-1';
    input.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('border-red-500');
  const errorDiv = input.parentNode.querySelector('.error-message');
  if (errorDiv) errorDiv.remove();
}

/**
 * Progress Bars Animation - Optimized
 */
function initProgressBars() {
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill, [style*="width"]');
        fills.forEach(fill => {
          const targetWidth = fill.style.width || '0%';
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.progress-bar, [class*="progress"]').forEach(bar => {
    observer.observe(bar);
  });
}

/**
 * Animation Observer - Entrance animations
 */
function observeAnimations() {
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.fade-in-up, .slide-in-right').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Theme Management - Simple
 */
function loadTheme() {
  const theme = StudyMate.settings.theme;
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const newTheme = StudyMate.settings.theme === 'light' ? 'dark' : 'light';
  StudyMate.settings.theme = newTheme;
  localStorage.setItem('studymate-theme', newTheme);
  loadTheme();
}

/**
 * Essential Utilities
 */
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Simple API helper
const API = {
  async post(url, data) {
    try {
      const response = await fetch(`/api${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

/**
 * Course enrollment - simplified
 */
function enrollInCourse(courseId) {
  if (!confirm('Đăng ký khóa học này?')) return;
  
  API.post(`/courses/${courseId}/enroll`, {})
    .then(data => {
      showNotification(data.success ? 'Đăng ký thành công!' : 'Có lỗi xảy ra', data.success ? 'success' : 'error');
      if (data.success) setTimeout(() => location.reload(), 1500);
    })
    .catch(() => showNotification('Lỗi kết nối', 'error'));
}

// AI Chat toggle function
function toggleAIChat() {
  const widget = document.getElementById('ai-chat-widget');
  if (widget) {
    widget.classList.toggle('hidden');
  }
}

// Export to global scope
Object.assign(window.StudyMate, {
  showNotification,
  toggleTheme,
  enrollInCourse,
  toggleAIChat,
  API
});

console.log('✅ StudyMate v' + StudyMate.version + ' ready');

