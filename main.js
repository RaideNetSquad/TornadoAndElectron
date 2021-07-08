const { app, BrowserWindow, ipcMain } = require("electron");
const { hostname } = require("os");
const path = require('path');

const createWindow = () => {
    const {net} = require('electron')

    const win = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: false
        }
    })
    win.webContents.openDevTools()

    win.loadFile('index.html')

    const request = net.request({
        protocol: "http:",
        hostname: "127.0.0.1",
        port: "8888", 
        method: "GET"});

    request.on('response', (response) => {
  
        response.on('error', (error) => {
            console.log(`ERROR: ${JSON.stringify(error)}`)
        })
        
        response.on('data', (data) => {
            win.webContents.on('dom-ready', () => {
                console.log(`Trying to send : ${data.toString('utf8')}`)
                win.webContents.send('message', JSON.parse(data.toString('utf8'))["User1"]);
            })
        })
    })
    request.on('finish', () => {
        console.log('Request is Finished')
    })
    request.on('abort', () => {
        console.log('Request is Aborted')
    })
    request.on('error', (error) => {
        console.log(`ERROR: ${JSON.stringify(error)}`)
    })
    request.on('close', (error) => {
        console.log('Last Transaction has occured')
    })
    request.setHeader('Content-Type', 'application/json')
    request.end()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})