const electron = require('electron')
const {ipcMain, app, globalShortcut, BrowserWindow, session} = electron
const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))

app.setName(config.productName)
var mainWindow = null
app.on('ready', function () {
    
    // Get correct Position in multi-monitor setup
    const width = 800;
    const height = 600;
    let bounds = electron.screen.getPrimaryDisplay().bounds;
    let x = Math.ceil(bounds.x + ((bounds.width - width) / 2));
    let y = Math.ceil(bounds.y + ((bounds.height - height) / 2));
    
    mainWindow = new BrowserWindow({
        x: x,
        y: y,
        backgroundColor: 'lightgray',
        title: config.productName,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8'
        }
    })

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['default-src \'none\'']
            }
        })
    })
    
    
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    
    // Enable keyboard shortcuts for Developer Tools on various platforms.
    let platform = os.platform()
    if (platform === 'darwin') {
        globalShortcut.register('Command+Option+I', () => {
            mainWindow.webContents.openDevTools()
        })
    } else if (platform === 'linux' || platform === 'win32') {
        globalShortcut.register('Control+Shift+I', () => {
            mainWindow.webContents.openDevTools()
        })
    }
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.setMenu(null)
        mainWindow.show()
    })
    
    mainWindow.onbeforeunload = (e) => {
        // Prevent Command-R from unloading the window contents.
        e.returnValue = false
    }
    
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    
    ipcMain.on('mainWindowLoaded', function(){
        mainWindow.webContents.send("item:add", {
            image: "n/a",
            name: "Toast",
            description: "Very Nice"
        })
    })
})

app.on('window-all-closed', () => { app.quit() })