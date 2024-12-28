chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    highlightSelectedText(request.text);
  }
});

function highlightSelectedText(text) {
  const bodyText = document.body.innerHTML;
  const highlightedText = `<span style="background-color: yellow;">${text}</span>`;
  document.body.innerHTML = bodyText.replace(text, highlightedText);
}
