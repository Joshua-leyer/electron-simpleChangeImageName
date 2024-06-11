const spanDom = document.querySelector('span');
const divDom = document.querySelector('#file-list');

function updateFilesList(filesList) {
  divDom.innerHTML = '';

  filesList.forEach(item => {
    let pElement = document.createElement('p')
    pElement.innerHTML = item
    divDom.appendChild(pElement)
  })
}

window.addEventListener('DOMContentLoaded',  () => {
  const selectBtn = document.querySelector('#selectBtn');

  selectBtn.addEventListener('click', async () => {
    console.log(`elect 点击了`, window.api)
    await window.api.selectFilesDialog((files)=>{
      console.log(`renderer拿到的文件列表是`, files)
      updateFilesList(files)

    })
  })
})



