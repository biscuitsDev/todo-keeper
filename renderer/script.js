let {ipcRenderer} = require('electron')

let title = document.getElementById('title')
let note = document.getElementById('note')
let list = document.getElementById('list')
let button = document.getElementById('button')
let deleteAll = document.getElementById('remove-button')

let allNotes = [];
const loadNotes = () => {
    list.innerHTML = ''
    allNotes.forEach(note =>{
        list.innerHTML += `
        <div class="element">
         <h1>${note.title}</h1>
         <h3>${note.note}</h3>
        </div>
        `
    })
}

window.onload = async () => {
    allNotes = await ipcRenderer.invoke("get_notes")
    loadNotes()
}


button.onclick = () => {
    console.log("object")
    let newNote = {title: title.value, note: note.value}
    allNotes.push(newNote)
    console.log(allNotes)
    loadNotes()
    ipcRenderer.send('save_note', newNote)
}

deleteAll.onclick = async () =>{
    console.log(allNotes)
    allNotes = await ipcRenderer.invoke('delete_all')
    console.log(allNotes)
    loadNotes();
}