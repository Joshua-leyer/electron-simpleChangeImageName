const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  selectFilesDialog: async (callback) => {
    console.log(`调用暴露出来的API`)
    let filesPath = await ipcRenderer.invoke('select-files-dialog')
    callback(filesPath)
  }
})
