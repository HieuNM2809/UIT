/**
 * Load recent activities dynamically
 */
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('recentActivityContainer');
  if (!container) return;

  loadRecentActivities();

  // Refresh activities every 30 seconds
  setInterval(loadRecentActivities, 30000);
});

async function loadRecentActivities() {
  const container = document.getElementById('recentActivityContainer');
  if (!container) return;

  try {
    const response = await fetch('/dashboard/api/recent-activities?limit=5', {
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error('Failed to load activities');
    }

    const result = await response.json();
    
    if (!result.success || !result.data || !result.data.activities) {
      throw new Error('Invalid response format');
    }

    const activities = result.data.activities;

    if (activities.length === 0) {
      container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Chưa có hoạt động nào</p>';
      return;
    }

    container.innerHTML = activities.map(activity => {
      const date = new Date(activity.time);
      const formattedDate = date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      let iconSvg = '';
      if (activity.icon === 'check-circle') {
        iconSvg = `
          <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        `;
      } else if (activity.icon === 'academic-cap') {
        iconSvg = `
          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
        `;
      } else {
        iconSvg = `
          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        `;
      }

      return `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            ${iconSvg}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">${escapeHtml(activity.title)}</p>
            <p class="text-xs text-gray-500 mt-1">
              ${escapeHtml(activity.course)} • ${formattedDate}
            </p>
          </div>
        </div>
      `;
    }).join('<div class="my-4 border-t border-gray-200"></div>');

    // Wrap in space-y-4 div
    container.innerHTML = `<div class="space-y-4">${container.innerHTML}</div>`;

  } catch (error) {
    console.error('Error loading recent activities:', error);
    container.innerHTML = '<p class="text-sm text-red-500 text-center py-4">Lỗi khi tải hoạt động gần đây</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

