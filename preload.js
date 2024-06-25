const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  selectFilesDialog: async (callback) => {
    let filesResult = await ipcRenderer.invoke('select-folder-dialog')
    // console.log(`返回回来的 files 结果:`, filesResult)
    callback(filesResult)
  },
  selectImgDialog: async (callback) => {
    let selectImgFallPath = await ipcRenderer.invoke('select-img-dialog')
    console.log(`选择照片后, preload 接受到返回的图片路径是`, selectImgFallPath)
    callback(selectImgFallPath)
  },
  changeImgNameAPI: async (ImageData, callback) => {
    // console.log(`changeImageNameAPI 发送给主进程的数据是：\n`, ImageData)
    let backImgNewName = await ipcRenderer.invoke('change-imgname', ImageData)
    console.log(`change-imgname 主进程修改名称后返回回来的数据是：`, backImgNewName)
    callback(backImgNewName)
  }
})
