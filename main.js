const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const fs = require('fs')
const path = require('node:path')

const desktopPath = path.join(app.getPath('desktop'));
let win;

const DefaultPath = 'P:\_Web_code\my-electron-filelist\sources';

const createWindow = () => {
  win = new BrowserWindow({
    width: 1430,
    height: 700,
    x: 100,
    y: 80,
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
    defaultPath: DefaultPath,
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

ipcMain.handle('select-img-dialog', async () => {
  const selectImgObj = await dialog.showOpenDialog(win, {
    title: '请选择一个图片',
    defaultPath: DefaultPath,
    properties: ['openFile'],
    filters: [
      {name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'webp']},
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  console.log(`对话框选择的图片是：`, selectImgObj)
  const imgPath = selectImgObj.filePaths;
  return imgPath[0]
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})