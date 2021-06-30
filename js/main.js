

// grab all relevant elements
const notesContainer = document.querySelector('.notes');
const addNoteBtn = document.querySelector('#add-note-btn');
const form = document.querySelector('#form');
const titleInput = document.querySelector('#title-input');
const noteInput = document.querySelector('#note-input');
const saveNoteBtn = document.querySelector('#save-note-btn');


// note class
class Note {
    constructor(title, note){
        this.title = title;
        this.note = note;
        this.id = Math.random();
    }
}



// fetch notes from database
function fetchNotes(){
    let notes;

    if(localStorage.getItem('notes') === null){
        notes = [];

    }else{
        notes = JSON.parse(localStorage.getItem('notes'));
    }

    return notes;
}




// add notes to database
function savetoDatabase(note){
    const notes = fetchNotes();
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}




// delete note from database
function deleteFromDatabase(id){
    const notes = fetchNotes();
    notes.forEach((note, i) => {
        if(note.id === id){
            notes.splice(i, 1);
        }
        localStorage.setItem('notes', JSON.stringify(notes));
    })
}






// adding to UI from class
function addNoteToPage(note){
    const newDiv = document.createElement('div');
    newDiv.className = 'note';

    newDiv.innerHTML = `<span hidden>${note.id}</span>`;
    newDiv.innerHTML += `<h1>${note.title}</h1>`;
    newDiv.innerHTML += `<p>${note.note}</p>`;
    newDiv.innerHTML += `<i class="fas fa-trash delete"></i>`;

    newDiv.addEventListener('click', (e) => {
        const readNote = document.querySelector('.read-note');

        readNote.innerHTML += `<h1>${newDiv.firstElementChild.nextElementSibling.textContent}</h1>`;
        readNote.innerHTML += `<p>${newDiv.lastElementChild.previousElementSibling.textContent}</p>`;
        readNote.classList.add('focus');
        // deactivate all other notes while reading
        document.querySelectorAll('.note').forEach(one => {
            one.style.opacity = '0';
            one.style.pointerEvents = 'none';
        })
        
        document.querySelector('.read-note .fa-backspace').addEventListener('click', (e) => {
            readNote.classList.remove('focus');
            setTimeout(() => {
                readNote.innerHTML = '<i class="fas fa-backspace"></i>';

                // activate all notes again
                document.querySelectorAll('.note').forEach(one => {
                    one.style.opacity = '1';
                    one.style.pointerEvents = 'auto';
                })
            }, 500)
        })
    })
    
    // append
    notesContainer.appendChild(newDiv);
}




// display notes in UI from database
function displayNotes(){
    const notes = fetchNotes();
    notes.forEach(note => {
        addNoteToPage(note);
    })
}



// delete a note
notesContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')){
        if(confirm('Are you sure?')){
            const noteDiv = e.target.closest('.note');
            noteDiv.remove();
            const id = noteDiv.querySelector('span').textContent;
            deleteFromDatabase(Number(id));

            setTimeout(() => {
                alert('Note Deleted');
            }, 1000)
        }
    }
})



// create new note
addNoteBtn.addEventListener('click', (e) => {
    form.classList.add('show');
    titleInput.focus();
})




// form
saveNoteBtn.addEventListener('click', (e) => {
    if(titleInput.value === '' || noteInput.value === ''){
        alert('Cannot save an empty note.');

    }else{
        const newNote = new Note(titleInput.value, noteInput.value);
        
        addNoteToPage(newNote);
        savetoDatabase(newNote);
        // clear form
        titleInput.value = null;
        noteInput.value = null;
        form.classList.remove('show');
    }
})



// clear form from back button
document.querySelector('#form .fa-backspace').addEventListener('click', (e) => {
    titleInput.value = null;
    noteInput.value = null;
    form.classList.remove('show');
})











// theme toggle

window.addEventListener('DOMContentLoaded', getTheme);

// set the theme
function getTheme(){
    if(JSON.parse(localStorage.getItem('theme')) === 'dark'){
        let currenTheme = JSON.parse(localStorage.getItem('theme'));
        document.body.classList.add(currenTheme);

        dark();
    }
}

const toggle = document.querySelector('.theme-toggle .fas');
toggle.addEventListener('click', dark);
// dark mode
function dark(e){
    toggle.className = 'fas fa-moon dark';
    toggle.removeEventListener('click', dark);
    toggle.addEventListener('click', light);
    document.body.classList.add('dark');

    localStorage.setItem('theme', JSON.stringify('dark'));

    setTimeout(() => {
        toggle.style.right = '2px';
        toggle.style.left = 'auto';
        toggle.style.width = '25px';

        setTimeout(() => {
            toggle.classList.remove('dark');
        }, 100)
        
    }, 500);
}

// light mode
function light(e){
    toggle.className = 'fas fa-sun light';
    toggle.removeEventListener('click', light);
    toggle.addEventListener('click', dark);
    document.body.classList.remove('dark');

    localStorage.setItem('theme', JSON.stringify('light'));
    
    setTimeout(() => {
        toggle.style.left = '2px';
        toggle.style.right = 'auto';
        toggle.style.width = '25px';

        setTimeout(() => {
            toggle.classList.remove('light');
        }, 100)
        
    }, 500);
}







// search notes
const searchInput = document.querySelector('header input');
searchInput.addEventListener('keyup', filterNotes);

function filterNotes(e){
    // convert everything to lowercase
    let searchText = e.target.value.toLowerCase();
    let allNotes = document.querySelectorAll('.note');

    Array.from(allNotes).forEach(one => {
        let noteText = one.firstElementChild.nextElementSibling.textContent.toLowerCase();

        if(noteText.indexOf(searchText) != -1){
            one.style.display = 'block';
        }else{
            one.style.display = 'none';
        }
    })
}


