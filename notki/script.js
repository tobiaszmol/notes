
function addNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const note = document.createElement('section');
        note.classList.add('note');
        const currentDate = new Date();
        note.dataset.date = currentDate.toISOString();
        note.innerHTML = `
            <p class="lato-thin">${noteText}</p>
            <button class="edit-btn" onclick="editNote(this)">Edytuj</button>
            <button class="delete-btn" onclick="deleteNote(this)">Usuń</button>
        `;
        document.getElementById('notesContainer').appendChild(note);
        noteInput.value = '';
        saveNoteToLocalStorage(noteText, currentDate.toISOString());
    }
}

function deleteNote(note) {
    const noteDate = note.parentNode.dataset.date;
    note.parentNode.remove();
    deleteNoteFromLocalStorage(noteDate);
}

function deleteNoteFromLocalStorage(date) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.date !== date);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function editNote(editButton) {
    const noteText = editButton.parentNode.querySelector('p').textContent;
    const newText = prompt('Edycja notatki', noteText);
    if (newText !== null && newText.trim() !== '') {
        editButton.parentNode.querySelector('p').textContent = newText;
        const noteDate = editButton.parentNode.dataset.date;
        updateNoteInLocalStorage(newText, noteDate);
    }
}

function saveNoteToLocalStorage(text, date) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ text, date });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNoteInLocalStorage(text, date) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = notes.findIndex(note => note.date === date);
    if (index !== -1) {
        notes[index].text = text;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function loadNotesFromLocalStorage() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        const noteElement = document.createElement('section');
        noteElement.classList.add('note');
        noteElement.dataset.date = note.date;
        noteElement.innerHTML = `
            <p>${note.text}</p>
            <button class="edit-btn" onclick="editNote(this)">Edytuj</button>
            <button class="delete-btn" onclick="deleteNote(this)">Usuń</button>
        `;
        document.getElementById('notesContainer').appendChild(noteElement);
    });
}

window.addEventListener('load', loadNotesFromLocalStorage);

function searchNotes() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        const noteText = note.textContent.toLowerCase();
        if (noteText.includes(searchInput)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}

document.getElementById('searchForm').addEventListener('input', searchNotes);

function filterNotes() {
    const filterValue = document.getElementById('filterSelect').value;
    const notes = document.querySelectorAll('.note');
    const currentDate = new Date();
    notes.forEach(note => {
        const noteDate = new Date(note.dataset.date);
        if (filterValue === 'all') {
            note.style.display = 'block';
        } else if (filterValue === 'today' && noteDate.toDateString() === currentDate.toDateString()) {
            note.style.display = 'block';
        } else if (filterValue === 'this-week' && noteDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay())) {
            note.style.display = 'block';
        } else if (filterValue === 'this-month' && noteDate.getMonth() === currentDate.getMonth() && noteDate.getFullYear() === currentDate.getFullYear()) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}

document.getElementById('filterSelect').addEventListener('change', filterNotes);
document.getElementById('noteForm').addEventListener('submit', addNote);