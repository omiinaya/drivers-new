require('electron-reload')(__dirname, { ignored: /db|[\/\\]\./, argv: [] })
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const sys = require('node-sysutil')

let window

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, './assets/html/index.html'));
  window = mainWindow;
};

function print(a) {
  window.webContents.send('LOG_REQUEST', a);
}

app.on('ready', function () {
  createWindow()
});

ipcMain.on('MAIN_REQUEST', function () {
  print(sys.get.CPUName())
})