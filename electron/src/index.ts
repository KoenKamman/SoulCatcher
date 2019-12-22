import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'dist/preload.js'),
    },
    icon: path.join(app.getAppPath(), 'assets/soulcatcher_logo.png')
  });

  win.removeMenu();

  win.loadFile('./app/index.html');

  win.webContents.openDevTools();

  win.on('maximize', () => {
    win?.webContents.send('window-maximized', true);
  });
  win.on('unmaximize', () => {
    win?.webContents.send('window-maximized', false);
  });

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

app.on('web-contents-created', (eventa, contents) => {
  contents.on('new-window', async (eventb) => {
    eventb.preventDefault();
  });
});

ipcMain.on('minimize-window', () => {
  win?.minimize();
});
ipcMain.on('maximize-window', () => {
  win?.maximize();
});
ipcMain.on('restore-window', () => {
  win?.restore();
});
ipcMain.on('close-window', () => {
  win?.close();
});
