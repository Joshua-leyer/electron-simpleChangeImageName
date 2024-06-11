const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  selectFilesDialog: async (callback) => {
    console.log(`调用暴露出来的API`)
    let files = await ipcRenderer.invoke('select-files-dialog')
    console.log(`返回回来的 files 列表:`, files)
    callback(files)
  }
})
