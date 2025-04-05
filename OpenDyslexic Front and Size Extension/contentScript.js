chrome.storage.sync.get(["fontSize", "useDyslexicFont"], function (data) {
    if (data.fontSize) {
      document.body.style.fontSize = `${data.fontSize}px`;
    }
  
    if (data.useDyslexicFont) {
      const dyslexicFontLink = document.createElement("link");
      dyslexicFontLink.href = "https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@latest/OpenDyslexic.css";
      dyslexicFontLink.rel = "stylesheet";
      document.head.appendChild(dyslexicFontLink);
      document.body.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
    }
  });