// popup.js

// When the user clicks "Generate Anki Card"
document.getElementById('generateBtn').addEventListener('click', () => {
    // Hide the copy button until new content is generated
    document.getElementById('copyBtn').style.display = 'none';
  
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        document.getElementById('result').innerText = "No active tab found.";
        return;
      }
      const tabId = tabs[0].id;
      
      // Inject a script into the active tab to extract the educational objective
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: extractEducationalObjective
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error("Scripting error: ", chrome.runtime.lastError);
          document.getElementById('result').innerText = "Error: " + chrome.runtime.lastError.message;
          return;
        }
        if (!results || results.length === 0) {
          document.getElementById('result').innerText = "Error: No results from script execution.";
          return;
        }
        const eduObjective = results[0].result;
        if (!eduObjective) {
          document.getElementById('result').innerText = "Educational objective not found. Please submit an answer first.";
          return;
        }
        
        // Retrieve the custom prompt template from storage
        chrome.storage.sync.get(['promptText'], function(items) {
            const promptTemplate = items.promptText || "Given the following educational objective for USMLE Step 1, convert it into a cloze-style Anki card. Use the {{c1::…}} format for cloze deletions to hide key terms, processes, or concepts that should be recalled. Include only high yield information as cloze deletions (e.g. c1, c2, etc). Provide only the card text that can be copy and pasted into an anki. Educational Objective: {educational_objective}";
          // Replace the placeholder with the extracted educational objective
          const promptText = promptTemplate.replace("{educational_objective}", eduObjective);
          document.getElementById('result').innerText = "Generating card...";
          
          // Send the prompt to the background script to call the ChatGPT API
          chrome.runtime.sendMessage({ prompt: promptText }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("SendMessage error: ", chrome.runtime.lastError);
              document.getElementById('result').innerText = "Error sending message: " + chrome.runtime.lastError.message;
              return;
            }
            if (response.error) {
              console.error("Detailed error:", response.error);
              document.getElementById('result').innerText = "Error generating card: " + JSON.stringify(response.error, null, 2);
            } else {
              // Extract the card text from the API response
              const cardText = response.choices &&
                               response.choices[0] &&
                               response.choices[0].message &&
                               response.choices[0].message.content;
              if (cardText) {
                document.getElementById('result').innerText = cardText;
                // Show the copy button now that we have content to copy.
                document.getElementById('copyBtn').style.display = 'block';
              } else {
                document.getElementById('result').innerText = "No content received.";
              }
            }
          });
        });
      });
    });
  });
  
  // Listener for the Copy Text button
  document.getElementById('copyBtn').addEventListener('click', () => {
    const text = document.getElementById('result').innerText;
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          document.getElementById('copyBtn').innerText = 'Copied!';
          setTimeout(() => {
            document.getElementById('copyBtn').innerText = 'Copy Text';
          }, 2000);
        })
        .catch(err => {
          console.error('Error copying text:', err);
        });
    }
  });
  
  // This function is injected into the active tab to extract the educational objective.
  function extractEducationalObjective() {
    try {
      const paragraphs = document.querySelectorAll("p");
      let eduObjective = "";
      paragraphs.forEach((p) => {
        if (p.innerText.includes("Educational objective:")) {
          eduObjective = p.innerText.split("Educational objective:")[1].trim();
        }
      });
      return eduObjective;
    } catch (err) {
      console.error("Error extracting educational objective:", err);
      return "";
    }
  }