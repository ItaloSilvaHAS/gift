
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 576,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../assets/icons/icon.png'),
    show: false,
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#000000'
  });

  mainWindow.loadFile('src/renderer/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (process.argv.includes('--dev')) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handlers for save/load system
ipcMain.handle('save-game', async (event, saveData) => {
  const savePath = path.join(__dirname, '../saves');
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }
  
  const fileName = `save_${Date.now()}.json`;
  fs.writeFileSync(path.join(savePath, fileName), JSON.stringify(saveData, null, 2));
  return fileName;
});

ipcMain.handle('load-game', async (event, fileName) => {
  const savePath = path.join(__dirname, '../saves', fileName);
  if (fs.existsSync(savePath)) {
    return JSON.parse(fs.readFileSync(savePath, 'utf8'));
  }
  return null;
});

ipcMain.handle('get-saves', async () => {
  const savePath = path.join(__dirname, '../saves');
  if (!fs.existsSync(savePath)) {
    return [];
  }
  
  return fs.readdirSync(savePath).filter(file => file.endsWith('.json'));
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
