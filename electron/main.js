const { app, BrowserWindow } = require('electron')

function createWindow() {

  const win = new BrowserWindow({

    width: 1400,
    height: 900,

    webPreferences: {

      nodeIntegration: true,
      contextIsolation: false

    }

  })

  win.loadURL('http://localhost:5173')

}

app.whenReady().then(() => {

  createWindow()

})