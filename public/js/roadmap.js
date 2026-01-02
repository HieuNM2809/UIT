// Roadmap personalization state
let personalizationData = {
  learningStyle: null,
  learningTime: null,
  skillLevel: null,
  courseDuration: null,
  topics: []
};

let currentStep = 1;
const totalSteps = 5;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateProgress();
  
  // Handle Enter key in topics input
  const topicsInput = document.getElementById('topicsInput');
  if (topicsInput) {
    topicsInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTopic();
      }
    });
  }

  // Handle custom duration input
  const customDuration = document.getElementById('customDuration');
  if (customDuration) {
    customDuration.addEventListener('change', function() {
      if (this.value) {
        personalizationData.courseDuration = this.value;
        updateSelectedOption('courseDuration', this.value);
      }
    });
  }
});

function openPersonalization() {
  const topicInput = document.getElementById('topicInput');
  const topic = topicInput?.value.trim();
  
  // Always set topic if provided, otherwise use default
  if (topic) {
    personalizationData.topics = [topic];
    const topicsInput = document.getElementById('topicsInput');
    if (topicsInput) {
      topicsInput.value = topic;
    }
    updateTopicsList();
  } else if (personalizationData.topics.length === 0) {
    // Set default topic if none provided
    personalizationData.topics = ['JavaScript'];
    const topicsInput = document.getElementById('topicsInput');
    if (topicsInput) {
      topicsInput.value = 'JavaScript';
    }
    updateTopicsList();
  }
  
  document.getElementById('personalizationModal').classList.remove('hidden');
  currentStep = 1;
  showStep(1);
  updateProgress();
}

function closeModal() {
  document.getElementById('personalizationModal').classList.add('hidden');
  resetPersonalization();
}

function skipPersonalization() {
  // Use default values
  personalizationData = {
    learningStyle: 'videos',
    learningTime: 'morning',
    skillLevel: 'beginner',
    courseDuration: '4-6',
    topics: personalizationData.topics.length > 0 ? personalizationData.topics : ['JavaScript']
  };
  
  generateRoadmap();
}

function selectOption(field, value, element) {
  personalizationData[field] = value;
  
  // Update UI
  document.querySelectorAll(`#step${currentStep} .option-card`).forEach(card => {
    card.classList.remove('border-purple-500', 'border-orange-500', 'border-blue-500', 'border-yellow-500', 'bg-purple-50', 'bg-orange-50', 'bg-blue-50', 'bg-yellow-50');
  });
  
  element.classList.add('border-purple-500', 'bg-purple-50');
  
  // Move to next step
  setTimeout(() => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
      updateProgress();
      
      // If moving to step 5 (topics), initialize topics from textarea
      if (currentStep === 5) {
        const topicsInput = document.getElementById('topicsInput');
        if (topicsInput && topicsInput.value.trim()) {
          const topicsText = topicsInput.value.trim();
          const topics = topicsText
            .split(/[,\n]/)
            .map(t => t.trim())
            .filter(t => t.length > 0);
          
          if (topics.length > 0) {
            personalizationData.topics = topics;
            updateTopicsList();
          }
        }
      }
    }
  }, 300);
}

function updateSelectedOption(field, value) {
  personalizationData[field] = value;
  // Update visual selection if needed
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(stepEl => {
    stepEl.classList.add('hidden');
  });
  
  // Show current step
  const currentStepEl = document.getElementById(`step${step}`);
  if (currentStepEl) {
    currentStepEl.classList.remove('hidden');
  }
}

function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
}

function addTopic() {
  const topicsInput = document.getElementById('topicsInput');
  const topic = topicsInput.value.trim();
  
  if (!personalizationData.topics) {
    personalizationData.topics = [];
  }
  
  if (topic && !personalizationData.topics.includes(topic)) {
    personalizationData.topics.push(topic);
    topicsInput.value = '';
    updateTopicsList();
  } else if (topic && personalizationData.topics.includes(topic)) {
    // Topic already exists, just clear the input
    topicsInput.value = '';
  }
}

function removeTopic(index) {
  personalizationData.topics.splice(index, 1);
  updateTopicsList();
}

function updateTopicsList() {
  const topicsList = document.getElementById('topicsList');
  topicsList.innerHTML = personalizationData.topics.map((topic, index) => `
    <span class="topic-tag inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
      ${escapeHtml(topic)}
      <button onclick="removeTopic(${index})" class="ml-2 text-purple-600 hover:text-purple-800">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </span>
  `).join('');
}

function selectTopic(topic) {
  document.getElementById('topicInput').value = topic;
  personalizationData.topics = [topic];
  openPersonalization();
}

async function generateRoadmap() {
  // Reset topics array
  personalizationData.topics = [];
  
  // First, check if we have topics in the topicsList (from added tags)
  const topicsList = document.getElementById('topicsList');
  if (topicsList && topicsList.children.length > 0) {
    // Extract topics from the tags - get text content and remove the close button text
    const topicTags = Array.from(topicsList.querySelectorAll('.topic-tag'));
    const topics = topicTags.map(tag => {
      // Get all text nodes, excluding button content
      const clone = tag.cloneNode(true);
      const buttons = clone.querySelectorAll('button');
      buttons.forEach(btn => btn.remove());
      return clone.textContent.trim();
    }).filter(t => t.length > 0);
    
    if (topics.length > 0) {
      personalizationData.topics = topics;
    }
  }
  
  // If still no topics, try to get from topicsInput in modal
  if (personalizationData.topics.length === 0) {
    const topicsInput = document.getElementById('topicsInput');
    if (topicsInput) {
      const topicsText = topicsInput.value.trim();
      if (topicsText) {
        // Parse topics from textarea (comma-separated or newline-separated)
        const topics = topicsText
          .split(/[,\n]/)
          .map(t => t.trim())
          .filter(t => t.length > 0);
        
        if (topics.length > 0) {
          personalizationData.topics = topics;
        }
      }
    }
  }
  
  // If still no topics, try to get from main topicInput
  if (personalizationData.topics.length === 0) {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput?.value.trim();
    
    if (topic) {
      personalizationData.topics = [topic];
    } else {
      alert('Vui lòng nhập ít nhất một chủ đề quan tâm');
      return;
    }
  }
  
  // Final validation before sending
  if (!personalizationData.topics || personalizationData.topics.length === 0) {
    alert('Vui lòng nhập ít nhất một chủ đề quan tâm');
    return;
  }
  
  // Save data before closing modal (which resets personalizationData)
  // Create a deep copy to avoid any reference issues
  const topicsCopy = Array.isArray(personalizationData.topics) 
    ? [...personalizationData.topics] 
    : [];
  
  const requestData = {
    learningStyle: personalizationData.learningStyle || null,
    learningTime: personalizationData.learningTime || null,
    skillLevel: personalizationData.skillLevel || null,
    courseDuration: personalizationData.courseDuration || null,
    topics: topicsCopy
  };
  
  console.log('Sending roadmap request with topics:', requestData.topics);
  console.log('Request data:', JSON.parse(JSON.stringify(requestData))); // Deep clone for logging

  // Close modal (this will reset personalizationData, but we already saved it)
  closeModal();

  // Show loading
  const roadmapResult = document.getElementById('roadmapResult');
  const roadmapContent = document.getElementById('roadmapContent');
  roadmapResult.classList.remove('hidden');
  roadmapContent.innerHTML = '<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>';

  try {
    // Final check - if topics is still empty, show error
    if (!requestData.topics || requestData.topics.length === 0) {
      roadmapContent.innerHTML = `
        <div class="text-center py-12">
          <p class="text-red-600 mb-4">Vui lòng nhập ít nhất một chủ đề quan tâm</p>
          <button onclick="closeResult()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">Đóng</button>
        </div>
      `;
      return;
    }
    
    const response = await fetch('/api/ai/roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Lỗi khi tạo lộ trình');
    }

    // Convert markdown to HTML (simple conversion)
    const markdown = result.data.roadmap;
    const html = convertMarkdownToHTML(markdown);
    
    roadmapContent.innerHTML = html;

    // Scroll to result
    roadmapResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    roadmapContent.innerHTML = `
      <div class="text-center py-12">
        <p class="text-red-600 mb-4">${escapeHtml(error.message || 'Lỗi khi tạo lộ trình học tập')}</p>
        <button onclick="generateRoadmap()" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
          Thử lại
        </button>
      </div>
    `;
  }
}

function convertMarkdownToHTML(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-10 mb-5">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 mb-2">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>');
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-2">$1</ul>');
  
  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (para.trim() && !para.match(/^<[h|u|o|l]/)) {
      return `<p class="mb-4 text-gray-700 leading-relaxed">${para.trim()}</p>`;
    }
    return para;
  }).join('\n');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function closeResult() {
  document.getElementById('roadmapResult').classList.add('hidden');
}

function resetPersonalization() {
  currentStep = 1;
  personalizationData = {
    learningStyle: null,
    learningTime: null,
    skillLevel: null,
    courseDuration: null,
    topics: []
  };
  document.querySelectorAll('.option-card').forEach(card => {
    card.classList.remove('border-purple-500', 'border-orange-500', 'border-blue-500', 'border-yellow-500', 'bg-purple-50', 'bg-orange-50', 'bg-blue-50', 'bg-yellow-50');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

