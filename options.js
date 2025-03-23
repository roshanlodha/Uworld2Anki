// options.js
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings from chrome.storage.sync
    chrome.storage.sync.get(['apiKey', 'promptText', 'model', 'maxTokens', 'temperature'], function(items) {
      if (items.apiKey) document.getElementById('apiKey').value = items.apiKey;
      if (items.promptText) document.getElementById('promptText').value = items.promptText;
      if (items.model) document.getElementById('model').value = items.model;
      if (items.maxTokens) document.getElementById('maxTokens').value = items.maxTokens;
      if (items.temperature) document.getElementById('temperature').value = items.temperature;
    });
  
    // Save settings when the form is submitted
    document.getElementById('settings-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const apiKey = document.getElementById('apiKey').value;
      const promptText = document.getElementById('promptText').value;
      const model = document.getElementById('model').value || "gpt-3.5-turbo";
      const maxTokens = parseInt(document.getElementById('maxTokens').value) || 150;
      const temperature = parseFloat(document.getElementById('temperature').value) || 0.7;
      
      chrome.storage.sync.set({ apiKey, promptText, model, maxTokens, temperature }, function() {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = 'Settings saved.';
        setTimeout(() => { statusDiv.textContent = ''; }, 2000);
      });
    });
  });