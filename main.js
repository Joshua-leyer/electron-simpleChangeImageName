const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const fs = require('fs')
const path = require('node:path')

const desktopPath = path.join(app.getPath('desktop'));
let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 500,
    height: 500,
    x: 300,
    y: 100,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.webContents.openDevTools() 
  
  Menu.setApplicationMenu(null);

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle('select-files-dialog', async () => {
  const fileObj = await dialog.showOpenDialog(win, {
    defaultPath: desktopPath,
    properties: ['openDirectory']
  })
  console.log(`对话框选择的文件对象是：`, fileObj)
  const filePath = fileObj.filePaths;
  // 返回路径
  // return filePath[0]
  return readFolder(filePath[0])
})

/**
 * readFolder Function
 */
function readFolder(filderPath) {
  try {
    const entries = fs.readdirSync(filderPath)
    console.log(`readed file:`, entries)
    return entries
  } catch (err) {
    console.error('Error reading folder:', err);
    return [];
  }
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})