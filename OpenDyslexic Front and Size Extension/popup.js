document.addEventListener('DOMContentLoaded', function () {
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontToggle = document.getElementById('fontToggle');
    const fontSizeDisplay = document.querySelector('.font-size-display');
    const applyBtn = document.getElementById('applyBtn');
  const fontSizeValue = document.getElementById("fontSizeValue");
  
  fontSizeSlider.addEventListener("input", function () {
    fontSizeValue.innerText = fontSizeSlider.value + "px";
  });
  
    // Load saved settings
    chrome.storage.sync.get(["fontSize", "useDyslexicFont"], function (data) {
      if (data.fontSize) {
        fontSizeSlider.value = data.fontSize;
        fontSizeDisplay.textContent = `Current Size: ${data.fontSize}px`;
      }
      if (data.useDyslexicFont !== undefined) {
        fontToggle.checked = data.useDyslexicFont;
      }
    });
  
    // Update displayed font size
    fontSizeSlider.addEventListener('input', function () {
      fontSizeDisplay.textContent = `Current Size: ${fontSizeSlider.value}px`;
    });
  
    // Apply settings when button is clicked
    applyBtn.addEventListener('click', function () {
      const fontSize = fontSizeSlider.value;
      const useDyslexicFont = fontToggle.checked;
  
      // Save settings
      chrome.storage.sync.set({ fontSize, useDyslexicFont });
  
      // Inject script to modify page fonts
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: changeFontSettings,
          args: [fontSize, useDyslexicFont]
        });
      });
    });
  
    // Function to change font settings on the webpage
    function changeFontSettings(fontSize, useDyslexicFont) {
      document.body.style.fontSize = `${fontSize}px`;
  
      if (useDyslexicFont) {
        const dyslexicFontLink = document.createElement("link");
        dyslexicFontLink.href = "https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@latest/OpenDyslexic.css";
        dyslexicFontLink.rel = "stylesheet";
        document.head.appendChild(dyslexicFontLink);
        document.body.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
      } else {
        document.body.style.fontFamily = ""; // Reset to default
      }
    }
  });