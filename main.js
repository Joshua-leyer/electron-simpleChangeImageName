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

// back : [文件夹路径，文件夹下文件名称列表]
ipcMain.handle('select-files-dialog', async () => {
  const fileObj = await dialog.showOpenDialog(win, {
    defaultPath: DefaultPath,
    properties: ['openDirectory']
  })

  console.log(`对话框选择的文件对象是：`, fileObj)
  const filePath = fileObj.filePaths;
  const filesList = readFolder(filePath[0])
  return [filePath[0], filesList]
})

/**
 * readFolder Function
 */
function readFolder(filderPath) {
  try {
    const filesList = fs.readdirSync(filderPath)
    console.log(`readed file:`, filesList)
    return filesList
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
  const imgFallPath = selectImgObj.filePaths;
  return imgFallPath[0]

})
// 修改成功后 返回， 新的文件名称。
ipcMain.handle('change-imgname', async (event, ImageData) => {
  console.log(`Received data from change-imgname process:`, ImageData)
  const dir = ImageData[0];
  const currentImgName = ImageData[2];
  const oldPath = path.join(dir, ImageData[1]);
  const newPath = path.join(dir, ImageData[2]);

  try {
    await fs.promises.rename(oldPath, newPath)
    console.log(`File renamed sucess: \n ${oldPath} \n >>> \n ${newPath}`)
    return currentImgName

  } catch (err) {
    console.log(`change Image Error!`, err)
    throw new Error('Change Image name Error!');
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})