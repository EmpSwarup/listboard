document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
});

// Load notes from chrome storage and display them
function loadNotes() {
  chrome.storage.sync.get({ notes: [] }, (data) => {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; // Clear the container before adding notes

    // Sort notes by timestamp (most recent first)
    const sortedNotes = data.notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedNotes.forEach((note, index) => {
      const noteElement = document.createElement('div');
      noteElement.className = 'note';
      noteElement.innerHTML = `
        <input type="text" class="note-text" value="${note.text}" data-id="${index}" readonly />
        <span class="timestamp">${note.timestamp}</span>
        <span class="delete-btn" data-id="${index}">x</span>
      `;

      notesContainer.appendChild(noteElement);
    });

    // Add delete and edit functionality as before
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteNote);
    });

    document.querySelectorAll('.note-text').forEach(note => {
      note.addEventListener('click', enableEdit);
      note.addEventListener('blur', saveEdit);
      note.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          saveEdit.call(this);
        }
      });
    });
  });
}

// Delete a note from chrome storage
function deleteNote() {
  const noteId = this.getAttribute('data-id');
  chrome.storage.sync.get({ notes: [] }, (data) => {
    const updatedNotes = data.notes.filter((_, index) => index != noteId);
    chrome.storage.sync.set({ notes: updatedNotes }, () => {
      loadNotes();  // Refresh the UI

      // Show a notification for note deleted
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Listboard",
        message: "Note deleted successfully!"
      });
    });
  });
}

// Enable editing of a note
function enableEdit(event) {
  event.target.removeAttribute('readonly');
  event.target.focus();
}

// Save the edited note
function saveEdit(event) {
  const noteId = event.target.getAttribute('data-id');
  const updatedText = event.target.value;

  chrome.storage.sync.get({ notes: [] }, (data) => {
    const updatedNotes = [...data.notes];
    updatedNotes[noteId] = updatedText;

    chrome.storage.sync.set({ notes: updatedNotes }, () => {
      event.target.setAttribute('readonly', true); // Disable editing after save
      loadNotes(); // Reload to update the UI
    });
  });
}
