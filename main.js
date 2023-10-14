const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 576,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./frontend/index.html')
  ipcMain.on('write-file', (event, data, filePath) => {
    // Read the contents of the local file using the fs module
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        event.reply('write-file-response', { success: false, error: err.message });
      } else {
        console.log('File written successfully:', filePath);
        event.reply('write-file-response', { success: true });
      }
    });
  })

  ipcMain.on('read-file', (event, filePath) => {
    // Read the contents of the local file using the fs module
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        event.reply('read-file-response', { success: false, error: err.message });
      } else {
        console.log('File read successfully:', data);
        event.reply('read-file-response', { success: true, data: data});
      }
    });
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})