document.addEventListener('DOMContentLoaded', function() {
  // Setup slider update listeners for maxTokens and temperature.
  const maxTokensSlider = document.getElementById('maxTokens');
  const maxTokensValue = document.getElementById('maxTokensValue');
  const temperatureSlider = document.getElementById('temperature');
  const temperatureValue = document.getElementById('temperatureValue');

  // Initialize slider display values.
  maxTokensValue.textContent = maxTokensSlider.value;
  temperatureValue.textContent = parseFloat(temperatureSlider.value).toFixed(1);

  maxTokensSlider.addEventListener('input', function() {
    maxTokensValue.textContent = maxTokensSlider.value;
  });

  temperatureSlider.addEventListener('input', function() {
    temperatureValue.textContent = parseFloat(temperatureSlider.value).toFixed(1);
  });

  // Load saved settings from chrome.storage.sync.
  chrome.storage.sync.get(['apiKey', 'promptText', 'model', 'maxTokens', 'temperature'], function(items) {
    if (items.apiKey) {
      document.getElementById('apiKey').value = items.apiKey;
    }
    if (items.promptText) {
      document.getElementById('promptText').value = items.promptText;
    }
    if (items.model) {
      // Set the corresponding radio input to checked.
      const modelInputs = document.querySelectorAll('input[name="model"]');
      modelInputs.forEach((input) => {
        input.checked = (input.value === items.model);
      });
    }
    if (items.maxTokens) {
      maxTokensSlider.value = items.maxTokens;
      maxTokensValue.textContent = items.maxTokens;
    }
    if (items.temperature) {
      temperatureSlider.value = items.temperature;
      temperatureValue.textContent = parseFloat(items.temperature).toFixed(1);
    }
  });

  // Save settings when the form is submitted.
  document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    const promptText = document.getElementById('promptText').value;
    // Get selected model value from radio buttons.
    const model = document.querySelector('input[name="model"]:checked').value || "gpt-3.5-turbo";
    const maxTokens = parseInt(document.getElementById('maxTokens').value) || 150;
    const temperature = parseFloat(document.getElementById('temperature').value) || 0.7;
    
    chrome.storage.sync.set({ apiKey, promptText, model, maxTokens, temperature }, function() {
      const statusDiv = document.getElementById('status');
      statusDiv.textContent = 'Settings saved.';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });
});