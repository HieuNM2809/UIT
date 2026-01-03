/**
 * Custom Right-Click Menu - Easter Egg Feature
 * Click chuột phải để hiện menu với options: Test và Tools
 */

(function() {
  'use strict';

  // State
  let customMenu = null;
  let isMenuVisible = false;

  /**
   * Tạo custom context menu
   */
  function createCustomMenu(x, y) {
    // Xóa menu cũ nếu có
    removeCustomMenu();

    // Tạo menu element
    customMenu = document.createElement('div');
    customMenu.id = 'custom-context-menu';
    customMenu.innerHTML = `
      <div class="custom-menu-item" data-action="test">
        <span class="menu-icon">🧪</span>
        <span class="menu-text">Test Features</span>
        <span class="menu-shortcut">Ctrl+T</span>
      </div>
      <div class="custom-menu-item" data-action="tools">
        <span class="menu-icon">🛠️</span>
        <span class="menu-text">Tools & Services</span>
        <span class="menu-shortcut">Ctrl+Shift+T</span>
      </div>
    `;

    // Thêm styles nếu chưa có
    if (!document.getElementById('custom-context-menu-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-context-menu-styles';
      style.textContent = `
        #custom-context-menu {
          position: fixed;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 4px;
          z-index: 10000;
          min-width: 220px;
          border: 1px solid #e5e7eb;
          animation: menuFadeIn 0.15s ease-out;
        }
        
        @keyframes menuFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .custom-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          color: #374151;
        }
        
        .custom-menu-item:hover {
          background: #f3f4f6;
          color: #111827;
        }
        
        .custom-menu-item:active {
          background: #e5e7eb;
        }
        
        .menu-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }
        
        .menu-text {
          flex: 1;
          font-weight: 500;
        }
        
        .menu-shortcut {
          font-size: 11px;
          color: #9ca3af;
          font-family: 'Courier New', monospace;
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    }

    // Đặt vị trí menu
    customMenu.style.left = x + 'px';
    customMenu.style.top = y + 'px';

    // Đảm bảo menu không vượt ra ngoài màn hình
    const rect = customMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      customMenu.style.left = (window.innerWidth - rect.width - 10) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      customMenu.style.top = (window.innerHeight - rect.height - 10) + 'px';
    }

    // Thêm event listeners cho menu items
    const menuItems = customMenu.querySelectorAll('.custom-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.getAttribute('data-action');
        handleMenuAction(action);
        removeCustomMenu();
      });
    });

    document.body.appendChild(customMenu);
    isMenuVisible = true;
  }

  /**
   * Xóa custom menu
   */
  function removeCustomMenu() {
    if (customMenu && customMenu.parentNode) {
      customMenu.parentNode.removeChild(customMenu);
      customMenu = null;
      isMenuVisible = false;
    }
  }

  /**
   * Xử lý action từ menu
   */
  function handleMenuAction(action) {
    switch(action) {
      case 'test':
        window.open('/test', '_blank');
        break;
      case 'tools':
        window.open('/tools', '_blank');
        break;
      default:
        break;
    }
  }

  /**
   * Xử lý right-click event
   */
  function handleContextMenu(event) {
    // Chỉ xử lý trên trang chủ
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      return;
    }

    // Ngăn context menu mặc định
    event.preventDefault();
    event.stopPropagation();

    // Lấy vị trí click
    const x = event.clientX;
    const y = event.clientY;

    // Hiển thị custom menu
    createCustomMenu(x, y);
  }

  /**
   * Xử lý click để đóng menu
   */
  function handleClick(event) {
    if (isMenuVisible && customMenu && !customMenu.contains(event.target)) {
      removeCustomMenu();
    }
  }

  /**
   * Xử lý ESC để đóng menu
   */
  function handleKeyDown(event) {
    if (event.key === 'Escape' && isMenuVisible) {
      removeCustomMenu();
    }
  }

  /**
   * Initialize
   */
  function init() {
    // Chỉ chạy trên trang chủ
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      return;
    }

    // Thêm event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    // Log để debug (có thể xóa trong production)
    console.log('🎯 Custom Right-Click Menu activated! Click chuột phải để xem menu Test & Tools.');
  }

  // Khởi tạo khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

