import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { debounce } from 'debounce';
import { UserConfig } from './models/user-config';
import { DotaServerLog } from './dota-server-log';
import { ServerInfo } from './models/server-info';
import { getDotaPath } from './steam-utils';
import { Store } from './store';

let win: BrowserWindow | null;
let startWin: BrowserWindow | null;

const userConfigStore = new Store<UserConfig>('user_config', {
  window: {
    width: 800,
    height: 600,
    maximized: false
  }
});

function createStartupWindow() {
  startWin = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    alwaysOnTop: true,
    center: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true
    },
    icon: path.join(app.getAppPath(), 'assets/soulcatcher_logo.png')
  });

  startWin.resizable = false;

  startWin.loadFile('./assets/soulcatcher_icon.svg');
}

function createWindow() {
  const userConfig = userConfigStore.get();
  win = new BrowserWindow({
    width: userConfig.window.width,
    height: userConfig.window.height,
    frame: false,
    show: false,
    minWidth: 400,
    minHeight: 300,
    backgroundColor: '#0e0e0e',
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'dist/preload.js')
    },
    icon: path.join(app.getAppPath(), 'assets/soulcatcher_logo.png')
  });

  win.removeMenu();

  if (userConfig.window.maximized) {
    win.maximize();
  }

  win.loadFile('./app/index.html');

  //win.webContents.openDevTools();

  win.on('ready-to-show', () => {
    win?.show();
  });

  win.on('maximize', () => {
    win?.webContents.send('window-maximized', true);
  });

  win.on('unmaximize', () => {
    win?.webContents.send('window-maximized', false);
  });

  win.on('closed', () => {
    win = null;
  });

  win.on('resize', debounce(() => {
    const bounds = win?.getBounds();
    if (bounds) {
      userConfig.window.height = bounds.height;
      userConfig.window.width = bounds.width;
      userConfigStore.set(userConfig);
    }
    }, 1000, false)
  );
}

app.on('ready', () => {
  createStartupWindow();
  setTimeout(async () => {
    createWindow();
    startWin?.close();
    const dotaPath = await getDotaPath();
    if (dotaPath) {
      const serverLogPath = dotaPath + '/game/dota/server_log.txt';
      const dotaServerLog = new DotaServerLog(serverLogPath);
      dotaServerLog.onUpdate((info: ServerInfo) => {
        win?.webContents.send('server-log-update', info);
      });
      dotaServerLog.watch();
      console.log('Watching server log...');
    }
  }, 2000);
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
  contents.on('new-window', async (eventb, navigationUrl) => {
    eventb.preventDefault();
    await shell.openExternal(navigationUrl);
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
