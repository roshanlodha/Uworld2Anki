document.addEventListener('DOMContentLoaded', function() {
  const maxTokensSlider = document.getElementById('maxTokens');
  const maxTokensValue = document.getElementById('maxTokensValue');
  const temperatureSlider = document.getElementById('temperature');
  const temperatureValue = document.getElementById('temperatureValue');

  maxTokensValue.textContent = maxTokensSlider.value;
  temperatureValue.textContent = parseFloat(temperatureSlider.value).toFixed(1);

  maxTokensSlider.addEventListener('input', function() {
    maxTokensValue.textContent = maxTokensSlider.value;
  });

  temperatureSlider.addEventListener('input', function() {
    temperatureValue.textContent = parseFloat(temperatureSlider.value).toFixed(1);
  });

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

  document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    const promptText = document.getElementById('promptText').value;
    // Get selected model value from radio buttons.
    const model = document.querySelector('input[name="model"]:checked').value || "ft:gpt-4o-mini-2024-07-18:personal:uworld2anki-v1:BETptg2X";
    const maxTokens = parseInt(document.getElementById('maxTokens').value) || 150;
    const temperature = parseFloat(document.getElementById('temperature').value) || 0.7;
    
    chrome.storage.sync.set({ apiKey, promptText, model, maxTokens, temperature }, function() {
      const statusDiv = document.getElementById('status');
      statusDiv.textContent = 'Settings saved.';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });
});