const spanDom = document.querySelector('span');
const imgListDom = document.querySelector('#file-list');
const changeBtnDom = document.querySelector('#changeImgBtn');
const selectBtn = document.querySelector('#selectBtn');
const imgDom = document.querySelector('#now-img');


function updateFilesList(filesList) {
  imgListDom.innerHTML = '';
  
  filesList.forEach((item) => {
    let imgPathInputElement = document.createElement('input')
    imgPathInputElement.value = item
    imgListDom.appendChild(imgPathInputElement)
  })
  // 更新图片路径p标签
  // filesList.forEach(item => {
  //   let pElement = document.createElement('p')
  //   pElement.innerHTML = item
  //   imgListDom.appendChild(pElement)
  // })
}

function updateImg(imgpath) {
  imgDom.src = imgpath;
}

window.addEventListener('DOMContentLoaded',  () => {

  selectBtn.addEventListener('click', async () => {
    // console.log(`elect 点击了`, window.api)
    await window.api.selectFilesDialog( (files) => {
      console.log(`renderer拿到的文件列表是`, files)
      updateFilesList(files)
    })
  })

  changeBtnDom.addEventListener('click', async () => {
    await window.api.selectImgDialog( (imgpath) => {
      console.log(`render拿到的图片路径是`, imgpath)
      updateImg(imgpath)
    })
  })

})



