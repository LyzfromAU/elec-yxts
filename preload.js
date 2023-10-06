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
    const data = {
      name: "John",
      age: 30,
      city: "New York"
    };
    const filePath = 'example.txt';

    // Send a message to the main process to write the file
    ipcRenderer.send('write-file', data, filePath);
  });
});

// Receive the response from the main process
  ipcRenderer.on('write-file-response', (event, response) => {
    if (response.success) {
      console.log('File write successful');
    } else {
      console.error('File write error:', response.error);
    }
  });

