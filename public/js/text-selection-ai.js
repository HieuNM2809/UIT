/**
 * Text Selection and AI Chat Feature
 * Works on all pages - allows users to select text and ask AI about it
 */
(function initTextSelectionAI() {
  // Only initialize if user is logged in (check for user data in page)
  // This is a simple check - you might want to enhance it
  if (typeof window === 'undefined') return;
  
  let selectedText = '';
  let selectionButton = null;
  
  // Create floating button for AI chat
  function createAIChatButton() {
    if (selectionButton) return selectionButton;
    
    const button = document.createElement('button');
    button.id = 'aiChatSelectionBtn';
    button.className = 'fixed z-50 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-lg transition-all duration-200 opacity-0 pointer-events-none';
    button.style.transition = 'opacity 0.2s, transform 0.2s, pointer-events 0.2s';
    button.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <span>Hỏi AI về đoạn này</span>
    `;
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (selectedText && selectedText.trim()) {
        // Save selected text to sessionStorage
        sessionStorage.setItem('aiChatSelectedText', selectedText.trim());
        // Redirect to AI chat page
        window.location.href = '/chat-ai';
      }
    });
    
    document.body.appendChild(button);
    selectionButton = button;
    return button;
  }
  
  // Show button at selection position
  function showSelectionButton(selection) {
    if (!selection || !selection.toString().trim()) {
      hideSelectionButton();
      return;
    }
    
    const button = createAIChatButton();
    selectedText = selection.toString().trim();
    
    if (!selectedText || selectedText.length < 3) {
      hideSelectionButton();
      return;
    }
    
    // Get selection range
    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position button above selection (or below if near top)
      const buttonHeight = 40;
      const buttonWidth = 200;
      const spacing = 10;
      
      let top = rect.top - buttonHeight - spacing;
      let left = rect.left + (rect.width / 2) - (buttonWidth / 2);
      
      // Adjust if button would go off screen
      if (top < 10) {
        top = rect.bottom + spacing;
      }
      if (left < 10) {
        left = 10;
      }
      if (left + buttonWidth > window.innerWidth - 10) {
        left = window.innerWidth - buttonWidth - 10;
      }
      
      button.style.top = `${top}px`;
      button.style.left = `${left}px`;
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
      button.style.transform = 'translateY(0)';
    } catch (error) {
      console.error('Error showing selection button:', error);
      hideSelectionButton();
    }
  }
  
  // Hide button
  function hideSelectionButton() {
    if (selectionButton) {
      selectionButton.style.opacity = '0';
      selectionButton.style.pointerEvents = 'none';
      selectionButton.style.transform = 'translateY(-10px)';
    }
    selectedText = '';
  }
  
  // Check if selection is in an editable or interactive element
  function isSelectionInEditableElement(selection) {
    if (!selection || !selection.anchorNode) return false;
    
    const node = selection.anchorNode.nodeType === Node.TEXT_NODE 
      ? selection.anchorNode.parentElement 
      : selection.anchorNode;
    
    if (!node) return false;
    
    // Check if inside input, textarea, or contenteditable
    const editable = node.closest('input, textarea, [contenteditable="true"]');
    if (editable) return true;
    
    // Check if inside code blocks (might want to exclude these)
    const codeBlock = node.closest('pre, code');
    if (codeBlock) return false; // Allow selection in code blocks
    
    return false;
  }
  
  // Handle text selection
  function handleTextSelection() {
    const selection = window.getSelection();
    
    if (selection && selection.toString().trim().length >= 3) {
      // Skip if selection is in editable elements
      if (isSelectionInEditableElement(selection)) {
        hideSelectionButton();
        return;
      }
      
      // Show button for any text selection (not just content sections)
      showSelectionButton(selection);
    } else {
      hideSelectionButton();
    }
  }
  
  // Initialize when DOM is ready
  function init() {
    // Create button (hidden initially)
    createAIChatButton();
    
    // Event listeners
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', function(e) {
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
        handleTextSelection();
      }
    });
    
    // Hide button when clicking elsewhere
    document.addEventListener('mousedown', function(e) {
      if (selectionButton && !selectionButton.contains(e.target)) {
        const selection = window.getSelection();
        if (!selection || !selection.toString().trim()) {
          hideSelectionButton();
        }
      }
    });
    
    // Hide button on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      hideSelectionButton();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleTextSelection, 100);
    });
    
    // Hide button on resize
    window.addEventListener('resize', function() {
      hideSelectionButton();
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

