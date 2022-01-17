const {app, BrowserWindow, ipcMain, autoUpdater, dialog } = require('electron')
require('update-electron-app')()
let Datastore = require('nedb')
let win;
let datastore;

// update 
const server = 'https://your-deployment-url.com'
const url = `${server}/update/${process.platform}/${app.getVersion()}`




const createWindow = () => {
win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    },
    autoHideMenuBar: true,
})
win.loadFile(__dirname + '/renderer/index.html')
win.addListener('ready-to-show', () => {
    win.show()
})
}

function initDatastore() {
    let path = app.getPath('userData')
    datastore = new Datastore({
        fileName: path + '/notes.json'
    })

    datastore.loadDatabase(err => {
        if(err) {
            console.log('Error loading database')
            throw err
        }else{
            console.log('Database loaded successfully')
        }
    })
}


app.whenReady().then(() =>{
    initDatastore()
    createWindow()
})

app.addListener('window-all-closed', () => {
    if(process.platform !== 'darwin') {app.quit();}
    win.onload = async () => {
    allNotes = await ipcRenderer.invoke("get_notes")
    loadNotes()
}
})

// all ipc calls here

ipcMain.on('save_note', (e, newNote) =>{
    datastore.insert(newNote, (err, newDoc) =>{
        if(err){
            console.log('There was an error inserting the doc')
            throw err
        }else{
            console.log(newDoc)
            console.log('data inseted successfully ')
        }
            })
})

ipcMain.handle('get_notes', async (e)=>{
    return new Promise((resolve, reject)=>{
        datastore.find({}, (err, docs) => {
            if(err){
                reject(err)
            }else{
                resolve(docs)
            }
        })
    })
})

ipcMain.handle('delete_all', async (e) => {
    return new Promise((resolve, reject) => {
         datastore.remove({}, { multi: true }, (err, numRemoved) => {
            if(err){
                reject(err)
            }else{
                console.log(numRemoved)
                resolve([])
                console.log('Deleted all documents successfully ---------')
            }
        });
        
    })
})