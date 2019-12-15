import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import path = require('path');

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(app.getAppPath(), 'dist/preload.js')
    }
  });

  win.loadFile('./app/index.html');

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('ping', (event: IpcMainEvent): void => {
  event.reply('pong');
});
