// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.prompt) {
      chrome.storage.sync.get(['apiKey', 'model', 'maxTokens', 'temperature'], function(items) {
        const apiKey = items.apiKey;
        if (!apiKey) {
          sendResponse({ error: "API key not set. Please set your API key in the options page." });
          return;
        }
        const model = items.model || "gpt-4o-mini";
        const maxTokens = items.maxTokens || 300;
        const temperature = items.temperature || 0.3;
        
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: message.prompt }],
            max_tokens: maxTokens,
            temperature: temperature
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log("ChatGPT API data:", data);
          sendResponse(data);
        })
        .catch(err => {
          console.error("Error calling ChatGPT API:", err);
          sendResponse({ error: err.toString() });
        });
      });
      return true; // Indicates asynchronous response
    }
  });