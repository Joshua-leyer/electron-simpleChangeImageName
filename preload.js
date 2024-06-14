const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  selectFilesDialog: async (callback) => {
    console.log(`调用暴露出来的API`)
    let files = await ipcRenderer.invoke('select-files-dialog')
    console.log(`返回回来的 files 列表:`, files)
    callback(files)
  },
  selectImgDialog: async (callback) => {
    let selectImg = await ipcRenderer.invoke('select-img-dialog')
    // console.log(`preload接受到返回的图片路径是`, selectImg)
    callback(selectImg)
  }
})
