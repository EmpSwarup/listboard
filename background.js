chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed, creating context menu...");

  // Create context menu when extension is installed
  chrome.contextMenus.create({
    id: "addToListboard",
    title: "Add to Listboard",
    contexts: ["selection"],
    icons: { "16": "icons/icon16.png" }
  });

  console.log("Context menu created");
});

// Listen for clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToListboard") {
    console.log("Context menu clicked");
    const selectedText = info.selectionText;
    const timestamp = new Date().toLocaleString();

    chrome.storage.sync.get({ notes: [] }, (data) => {
      const updatedNotes = [...data.notes, { text: selectedText, timestamp }];
      chrome.storage.sync.set({ notes: updatedNotes }, () => {
        // Send message to content script to highlight text
        chrome.tabs.sendMessage(tab.id, { action: "highlightText", text: selectedText });

        // Show a notification for note added
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "Listboard",
          message: "Note added successfully!"
        });
      });
    });
  }
});
