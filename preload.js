const { contextBridge, ipcMain, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})


// Assuming you have a button with the id "writeFileButton" in your HTML
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('write').addEventListener('click', () => {
    const data = document.getElementById('inventoryList').innerHTML;
    const filePath = 'inventory.txt';

    // Send a message to the main process to write the file
    ipcRenderer.send('write-file', data, filePath);
  });
  ipcRenderer.send('read-file', 'inventory.txt');
});

// Receive the response from the main process
  ipcRenderer.on('write-file-response', (event, response) => {
    if (response.success) {
      console.log('File write successful');
    } else {
      console.error('File write error:', response.error);
    }
  });

  ipcRenderer.on('read-file-response', (event, response) => {
    if (response.success) {
      console.log('Read write successful');
      
    } else {
      console.error('Read write error:', response.error);
    }
  });

