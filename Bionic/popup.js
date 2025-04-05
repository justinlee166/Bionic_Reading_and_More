document.getElementById('toggleButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { toggleBionicReading: true }, (response) => {
        console.log(response ? response.result : "No response");
      });
    });
  });