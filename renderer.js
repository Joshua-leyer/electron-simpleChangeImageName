window.addEventListener('DOMContentLoaded',  () => {
  const selectBtn = document.querySelector('#selectBtn')
  selectBtn.addEventListener('click', async () => {
    console.log(`elect 点击了`, window.api)
    await window.api.selectFilesDialog((filePath)=>{
      console.log(`拿到的文件路径是`, filePath)
    })
  })
})



