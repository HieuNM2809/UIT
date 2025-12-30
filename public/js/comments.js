/**
 * Comments functionality for course pages
 */
class CommentsManager {
  constructor(courseSlug) {
    this.courseSlug = courseSlug;
    this.currentPage = 1;
    this.currentSort = 'newest';
    this.loading = false;
    this.hasMorePages = false;
    this.replyingTo = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadComments();
  }

  bindEvents() {
    // Comment form submission
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
    }

    // Character counter for comment content
    const commentContent = document.getElementById('commentContent');
    if (commentContent) {
      commentContent.addEventListener('input', (e) => this.updateCharCount(e));
      commentContent.addEventListener('focus', () => this.showCommentButtons());
    }

    // Cancel comment
    const cancelBtn = document.getElementById('cancelComment');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelComment());
    }

    // Sort change
    const sortSelect = document.getElementById('commentSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.handleSortChange(e));
    }

    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => this.loadMoreComments());
    }
  }

  updateCharCount(e) {
    const content = e.target.value;
    const charCount = document.getElementById('commentCharCount');
    const submitBtn = document.getElementById('submitComment');
    
    if (charCount) {
      charCount.textContent = content.length;
    }

    if (submitBtn) {
      submitBtn.disabled = content.trim().length === 0 || content.length > 5000;
    }
  }

  showCommentButtons() {
    const cancelBtn = document.getElementById('cancelComment');
    if (cancelBtn) {
      cancelBtn.classList.remove('hidden');
    }
  }

  cancelComment() {
    const commentContent = document.getElementById('commentContent');
    const cancelBtn = document.getElementById('cancelComment');
    const charCount = document.getElementById('commentCharCount');
    const submitBtn = document.getElementById('submitComment');

    if (commentContent) commentContent.value = '';
    if (cancelBtn) cancelBtn.classList.add('hidden');
    if (charCount) charCount.textContent = '0';
    if (submitBtn) submitBtn.disabled = true;

    this.replyingTo = null;
    this.hideReplyForm();
  }

  async handleCommentSubmit(e) {
    e.preventDefault();
    
    if (this.loading) return;

    const content = document.getElementById('commentContent').value.trim();
    if (!content) return;

    this.loading = true;
    const submitBtn = document.getElementById('submitComment');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';
    }

    try {
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          course_id: window.courseData?.id,
          parent_id: this.replyingTo
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        this.cancelComment();
        
        // Reload comments to show new comment
        if (this.replyingTo) {
          // If replying, reload comments to show the reply
          this.loadComments();
        } else {
          // If new comment, add to top of list
          this.prependComment(result.data);
        }

        // Show success message
        this.showNotification('Bình luận thành công!', 'success');
      } else {
        this.showNotification(result.message || 'Có lỗi xảy ra khi gửi bình luận', 'error');
      }
    } catch (error) {
      console.error('Comment submission error:', error);
      this.showNotification('Có lỗi xảy ra khi gửi bình luận', 'error');
    } finally {
      this.loading = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Bình luận';
      }
    }
  }

  async loadComments(reset = true) {
    if (this.loading) return;

    this.loading = true;
    const loadingEl = document.getElementById('commentsLoading');
    const emptyEl = document.getElementById('commentsEmpty');
    const listEl = document.getElementById('commentsList');

    if (reset) {
      this.currentPage = 1;
      if (loadingEl) loadingEl.classList.remove('hidden');
      if (emptyEl) emptyEl.classList.add('hidden');
    } else {
      // Show loading state for load more
      this.updateLoadMoreButton();
    }

    try {
      const response = await fetch(
        `/comments/course/${this.courseSlug}?page=${this.currentPage}&sort=${this.currentSort}&limit=5`
      );
      const result = await response.json();

      if (result.success) {
        const comments = result.data.comments;
        const pagination = result.data.pagination;

        if (reset) {
          this.renderComments(comments);
        } else {
          this.appendComments(comments);
        }

        this.updateCommentCount(pagination.total_items);
        this.hasMorePages = pagination.has_next;
        this.updateLoadMoreButton();

        if (comments.length === 0 && reset) {
          if (emptyEl) emptyEl.classList.remove('hidden');
        } else {
          // Hide empty state if we have comments
          if (emptyEl) emptyEl.classList.add('hidden');
        }
      } else {
        console.error('Failed to load comments:', result.message);
        this.showNotification('Không thể tải bình luận', 'error');
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      this.showNotification('Lỗi khi tải bình luận', 'error');
    } finally {
      this.loading = false;
      if (loadingEl) loadingEl.classList.add('hidden');
      this.updateLoadMoreButton();
    }
  }

  renderComments(comments) {
    const listEl = document.getElementById('commentsList');
    if (!listEl) return;

    // Clear existing comments (except loading/empty states)
    const commentsToRemove = listEl.querySelectorAll('.comment-item');
    commentsToRemove.forEach(el => el.remove());

    const loadingEl = document.getElementById('commentsLoading');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    // Add new comments
    comments.forEach(comment => {
      const commentEl = this.createCommentElement(comment);
      // Insert before loading element if it exists
      if (loadingEl && loadingEl.parentNode === listEl) {
        listEl.insertBefore(commentEl, loadingEl);
      } else if (loadMoreContainer && loadMoreContainer.parentNode === listEl) {
        listEl.insertBefore(commentEl, loadMoreContainer);
      } else {
        listEl.appendChild(commentEl);
      }
    });
  }

  appendComments(comments) {
    const listEl = document.getElementById('commentsList');
    if (!listEl) return;

    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadingEl = document.getElementById('commentsLoading');
    
    comments.forEach(comment => {
      const commentEl = this.createCommentElement(comment);
      // Insert before load more container, or before loading element if container doesn't exist
      if (loadMoreContainer && loadMoreContainer.parentNode === listEl) {
        listEl.insertBefore(commentEl, loadMoreContainer);
      } else if (loadingEl && loadingEl.parentNode === listEl) {
        listEl.insertBefore(commentEl, loadingEl);
      } else {
        listEl.appendChild(commentEl);
      }
    });
  }

  prependComment(comment) {
    const listEl = document.getElementById('commentsList');
    if (!listEl) return;

    const commentEl = this.createCommentElement(comment);
    const firstComment = listEl.querySelector('.comment-item');
    
    if (firstComment) {
      listEl.insertBefore(commentEl, firstComment);
    } else {
      // No existing comments, insert before loading/empty elements
      const loadingEl = document.getElementById('commentsLoading');
      const emptyEl = document.getElementById('commentsEmpty');
      
      if (loadingEl && loadingEl.parentNode === listEl) {
        listEl.insertBefore(commentEl, loadingEl);
      } else if (emptyEl && emptyEl.parentNode === listEl) {
        listEl.insertBefore(commentEl, emptyEl);
      } else {
        listEl.appendChild(commentEl);
      }
    }

    // Hide empty state
    const emptyEl = document.getElementById('commentsEmpty');
    if (emptyEl) emptyEl.classList.add('hidden');

    // Update count
    const countEl = document.getElementById('commentCount');
    if (countEl) {
      const match = countEl.textContent.match(/(\d+)/);
      const currentCount = match ? parseInt(match[1]) : 0;
      countEl.textContent = `${currentCount + 1} bình luận`;
    }
  }

  createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.dataset.commentId = comment.id;
    
    const isEdited = comment.is_edited;
    const editedText = isEdited ? `<span class="text-xs text-gray-400 ml-2">(đã chỉnh sửa)</span>` : '';
    
    const repliesHtml = comment.replies && comment.replies.length > 0 
      ? comment.replies.map(reply => this.createReplyHtml(reply)).join('')
      : '';

    div.innerHTML = `
      <div class="flex space-x-3">
        <div class="flex-shrink-0">
          ${comment.user.avatar 
            ? `<img class="h-10 w-10 rounded-full" src="${comment.user.avatar}" alt="${comment.user.first_name} ${comment.user.last_name}">`
            : `<div class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                 <span class="text-white text-sm font-medium">${comment.user.first_name.charAt(0)}${comment.user.last_name.charAt(0)}</span>
               </div>`
          }
        </div>
        <div class="flex-1">
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-sm font-medium text-gray-900">${comment.user.first_name} ${comment.user.last_name}</h4>
              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <span>${this.formatDate(comment.created_at)}</span>
                ${editedText}
              </div>
            </div>
            <div class="text-sm text-gray-700 whitespace-pre-wrap">${this.escapeHtml(comment.content)}</div>
          </div>
          <div class="flex items-center space-x-4 mt-2 text-sm">
            <button class="like-btn flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors" data-comment-id="${comment.id}">
            </button>
            <button class="reply-btn text-gray-500 hover:text-primary-600 transition-colors" data-comment-id="${comment.id}"> 
            </button>
            ${this.canModifyComment(comment) ? `
              <button class="edit-btn text-gray-500 hover:text-primary-600 transition-colors" data-comment-id="${comment.id}">
                Sửa
              </button>
              <button class="delete-btn text-gray-500 hover:text-red-600 transition-colors" data-comment-id="${comment.id}">
                Xóa
              </button>
            ` : ''}
          </div>
          ${repliesHtml}
        </div>
      </div>
    `;

    this.bindCommentEvents(div);
    return div;
  }

  createReplyHtml(reply) {
    const isEdited = reply.is_edited;
    const editedText = isEdited ? `<span class="text-xs text-gray-400 ml-2">(đã chỉnh sửa)</span>` : '';

    return `
      <div class="mt-4 ml-8 comment-reply" data-comment-id="${reply.id}">
        <div class="flex space-x-3">
          <div class="flex-shrink-0">
            ${reply.user.avatar 
              ? `<img class="h-8 w-8 rounded-full" src="${reply.user.avatar}" alt="${reply.user.first_name} ${reply.user.last_name}">`
              : `<div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                   <span class="text-white text-xs font-medium">${reply.user.first_name.charAt(0)}${reply.user.last_name.charAt(0)}</span>
                 </div>`
            }
          </div>
          <div class="flex-1">
            <div class="bg-white border rounded-lg p-3">
              <div class="flex items-center justify-between mb-1">
                <h5 class="text-sm font-medium text-gray-900">${reply.user.first_name} ${reply.user.last_name}</h5>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span>${this.formatDate(reply.created_at)}</span>
                  ${editedText}
                </div>
              </div>
              <div class="text-sm text-gray-700 whitespace-pre-wrap">${this.escapeHtml(reply.content)}</div>
            </div>
            <div class="flex items-center space-x-4 mt-2 text-sm">
              <button class="like-btn flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors" data-comment-id="${reply.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="like-count">${reply.likes_count || 0}</span>
              </button>
              ${this.canModifyComment(reply) ? `
                <button class="edit-btn text-gray-500 hover:text-primary-600 transition-colors" data-comment-id="${reply.id}">
                  Sửa
                </button>
                <button class="delete-btn text-gray-500 hover:text-red-600 transition-colors" data-comment-id="${reply.id}">
                  Xóa
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindCommentEvents(commentEl) {
    // Like button
    const likeBtn = commentEl.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => this.handleLike(e));
    }

    // Reply button
    const replyBtn = commentEl.querySelector('.reply-btn');
    if (replyBtn) {
      replyBtn.addEventListener('click', (e) => this.handleReply(e));
    }

    // Edit button
    const editBtn = commentEl.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => this.handleEdit(e));
    }

    // Delete button
    const deleteBtn = commentEl.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => this.handleDelete(e));
    }
  }

  async handleLike(e) {
    e.preventDefault();
    const commentId = e.currentTarget.dataset.commentId;
    
    try {
      const response = await fetch(`/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin' // Include cookies for session
      });
      
      // Check if response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Like response:', result); // Debug log
      console.log('Response status:', response.status); // Debug status
      
      if (result.success) {
        const likeCountEl = e.currentTarget.querySelector('.like-count');
        if (likeCountEl) {
          likeCountEl.textContent = result.data.likes_count;
        }
        
        // Update button appearance based on like status
        const btn = e.currentTarget;
        if (result.data.liked) {
          btn.classList.add('text-red-500');
          btn.classList.remove('text-gray-500');
        } else {
          btn.classList.remove('text-red-500');
          btn.classList.add('text-gray-500');
        }
        
        // Show success message (optional - comment out if too many notifications)
        // this.showNotification(result.message || (result.data.liked ? 'Đã thích bình luận' : 'Đã bỏ thích bình luận'), 'success');
      } else {
        this.showNotification(result.message || 'Có lỗi xảy ra khi thích bình luận', 'error');
      }
    } catch (error) {
      console.error('Like error:', error);
      this.showNotification('Có lỗi xảy ra khi thích bình luận', 'error');
    }
  }

  handleReply(e) {
    e.preventDefault();
    const commentId = e.currentTarget.dataset.commentId;
    
    this.replyingTo = commentId;
    
    const commentContent = document.getElementById('commentContent');
    if (commentContent) {
      commentContent.focus();
      commentContent.placeholder = 'Nhập phản hồi của bạn...';
    }
    
    this.showNotification('Đang trả lời bình luận. Nhập phản hồi bên trên.', 'info');
  }

  handleEdit(e) {
    e.preventDefault();
    const commentId = e.currentTarget.dataset.commentId;
    const commentEl = document.querySelector(`[data-comment-id="${commentId}"]`);
    
    if (!commentEl) return;
    
    // Find the comment content element
    const contentEl = commentEl.querySelector('.text-sm.text-gray-700.whitespace-pre-wrap');
    if (!contentEl) return;
    
    const originalContent = contentEl.textContent.trim();
    const commentContainer = contentEl.parentElement;
    
    // Create edit form
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
      <textarea 
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
        rows="3"
        maxlength="5000">${originalContent}</textarea>
      <div class="flex items-center justify-between mt-2">
        <div class="text-xs text-gray-500">
          <span class="char-counter">0</span>/5000 ký tự
        </div>
        <div class="flex space-x-2">
          <button type="button" class="cancel-edit-btn px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Hủy
          </button>
          <button type="button" class="save-edit-btn px-3 py-1.5 text-xs font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700">
            Lưu
          </button>
        </div>
      </div>
    `;
    
    // Hide original content and buttons
    commentContainer.style.display = 'none';
    const buttonsContainer = commentEl.querySelector('.flex.items-center.space-x-4.mt-2.text-sm');
    if (buttonsContainer) buttonsContainer.style.display = 'none';
    
    // Insert edit form
    commentContainer.parentElement.insertBefore(editForm, commentContainer.nextSibling);
    
    const textarea = editForm.querySelector('textarea');
    const charCounter = editForm.querySelector('.char-counter');
    const cancelBtn = editForm.querySelector('.cancel-edit-btn');
    const saveBtn = editForm.querySelector('.save-edit-btn');
    
    // Focus and select content
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    
    // Update character counter
    const updateCharCounter = () => {
      const length = textarea.value.length;
      charCounter.textContent = length;
      charCounter.parentElement.className = length > 5000 ? 'text-xs text-red-500' : 'text-xs text-gray-500';
      saveBtn.disabled = length === 0 || length > 5000 || textarea.value.trim() === originalContent.trim();
    };
    
    textarea.addEventListener('input', updateCharCounter);
    updateCharCounter();
    
    // Cancel edit
    const cancelEdit = () => {
      editForm.remove();
      commentContainer.style.display = '';
      if (buttonsContainer) buttonsContainer.style.display = '';
    };
    
    cancelBtn.addEventListener('click', cancelEdit);
    
    // Handle escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        cancelEdit();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Save edit
    saveBtn.addEventListener('click', async () => {
      const newContent = textarea.value.trim();
      if (!newContent || newContent === originalContent.trim()) {
        cancelEdit();
        return;
      }
      
      if (newContent.length > 5000) {
        this.showNotification('Nội dung không được vượt quá 5000 ký tự', 'error');
        return;
      }
      
      // Show loading
      saveBtn.disabled = true;
      saveBtn.textContent = 'Đang lưu...';
      
      try {
        const response = await fetch(`/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            content: newContent
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Update content
          contentEl.textContent = newContent;
          
          // Add edited indicator if not already present
          const timeContainer = commentEl.querySelector('.flex.items-center.space-x-2.text-xs.text-gray-500');
          if (timeContainer) {
            const existingEdited = timeContainer.querySelector('.text-xs.text-gray-400');
            if (!existingEdited) {
              const editedSpan = document.createElement('span');
              editedSpan.className = 'text-xs text-gray-400 ml-2';
              editedSpan.textContent = '(đã chỉnh sửa)';
              timeContainer.appendChild(editedSpan);
            }
          }
          
          cancelEdit();
          this.showNotification('Cập nhật bình luận thành công', 'success');
          document.removeEventListener('keydown', handleEscape);
        } else {
          this.showNotification(result.message || 'Có lỗi xảy ra khi cập nhật bình luận', 'error');
          saveBtn.disabled = false;
          saveBtn.textContent = 'Lưu';
        }
      } catch (error) {
        console.error('Edit error:', error);
        this.showNotification('Có lỗi xảy ra khi cập nhật bình luận', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Lưu';
      }
    });
  }

  async handleDelete(e) {
    e.preventDefault();
    const commentId = e.currentTarget.dataset.commentId;
    
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }
    
    try {
      const response = await fetch(`/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const commentEl = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentEl) {
          // Smooth fade out animation
          commentEl.style.opacity = '0';
          commentEl.style.transform = 'translateY(-10px)';
          commentEl.style.transition = 'all 0.3s ease-out';
          
          setTimeout(() => {
            commentEl.remove();
            // Update comment count
            const countEl = document.getElementById('commentCount');
            if (countEl) {
              const match = countEl.textContent.match(/(\d+)/);
              const currentCount = match ? parseInt(match[1]) : 0;
              const newCount = Math.max(0, currentCount - 1);
              countEl.textContent = `${newCount} bình luận`;
            }
          }, 300);
          
          this.showNotification('Đã xóa bình luận', 'success');
        }
      } else {
        this.showNotification(result.message || 'Có lỗi xảy ra khi xóa bình luận', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      this.showNotification('Có lỗi xảy ra khi xóa bình luận', 'error');
    }
  }

  handleSortChange(e) {
    this.currentSort = e.target.value;
    this.loadComments(true);
  }

  loadMoreComments() {
    if (this.hasMorePages && !this.loading) {
      this.currentPage++;
      this.loadComments(false);
    }
  }

  updateCommentCount(count) {
    const countEl = document.getElementById('commentCount');
    if (countEl) {
      countEl.textContent = `${count} bình luận`;
    }
  }

  updateLoadMoreButton() {
    const container = document.getElementById('loadMoreContainer');
    const btn = document.getElementById('loadMoreBtn');
    
    if (container && btn) {
      if (this.hasMorePages && !this.loading) {
        container.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Xem thêm bình luận';
      } else if (this.loading) {
        container.classList.remove('hidden');
        btn.disabled = true;
        btn.textContent = 'Đang tải...';
      } else {
        container.classList.add('hidden');
      }
    }
  }

  canModifyComment(comment) {
    // Check if current user can modify this comment
    const currentUser = window.user;
    if (!currentUser) return false;
    
    // User can modify their own comments or admin can modify any
    return comment.user.id === currentUser.id || 
           ['admin', 'system_admin'].includes(currentUser.role);
  }

  hideReplyForm() {
    const commentContent = document.getElementById('commentContent');
    if (commentContent) {
      commentContent.placeholder = 'Chia sẻ suy nghĩ của bạn về khóa học này...';
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    
    notification.classList.add(bgColor, 'text-white');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get course data from global variable set by EJS template
  if (window.courseData && window.courseData.slug) {
    // Initialize comments manager with course slug
    window.commentsManager = new CommentsManager(window.courseData.slug);
  } else {
    // Fallback: Get course slug from URL
    const pathParts = window.location.pathname.split('/');
    const courseSlug = pathParts[pathParts.length - 1];
    window.commentsManager = new CommentsManager(courseSlug);
  }
});
