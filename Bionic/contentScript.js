let isBionicReadingEnabled = false;
let originalBodyHTML = null;

function transformTextNode(textNode) {
  const text = textNode.nodeValue;
  // Split the text and preserve whitespace tokens.
  const parts = text.split(/(\s+)/);
  const frag = document.createDocumentFragment();
  parts.forEach(part => {
    if (/\s+/.test(part) || part === "") {
      // If part is whitespace or empty, append as-is.
      frag.appendChild(document.createTextNode(part));
    } else {
      const half = Math.ceil(part.length / 2);
      const span = document.createElement("span");
      span.innerHTML = `<b>${part.substring(0, half)}</b>${part.substring(half)}`;
      frag.appendChild(span);
    }
  });
  textNode.parentNode.replaceChild(frag, textNode);
}

function applyBionicReading() {
  // Save the original page HTML on first run.
  if (!originalBodyHTML) {
    originalBodyHTML = document.body.innerHTML;
  }
  // Use a TreeWalker to find text nodes that are not inside SCRIPT or STYLE.
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (
          node.parentNode &&
          (node.parentNode.nodeName === "SCRIPT" || node.parentNode.nodeName === "STYLE")
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  nodes.forEach(node => transformTextNode(node));
}

function disableBionicReading() {
  // Restore original HTML if stored.
  if (originalBodyHTML !== null) {
    document.body.innerHTML = originalBodyHTML;
  }
}

function toggleBionicReading() {
  if (isBionicReadingEnabled) {
    disableBionicReading();
  } else {
    applyBionicReading();
  }
  isBionicReadingEnabled = !isBionicReadingEnabled;
}

// Listen for messages from popup.js to toggle Bionic Reading.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.toggleBionicReading) {
    toggleBionicReading();
    sendResponse({ result: "Toggled Bionic Reading" });
  }
});