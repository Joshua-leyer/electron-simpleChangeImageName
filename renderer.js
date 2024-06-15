const spanDom = document.querySelector('span');
const imgListDom = document.querySelector('#file-list');
const changeBtnDom = document.querySelector('#changeImgBtn');
const selectBtn = document.querySelector('#selectBtn');
const imgDom = document.querySelector('#now-img');
const filesPathDom = document.querySelector('#files-path');


let oldInputValue = '';
// 保存 input 旧的内容
function handleInputFocus(event) {
  oldInputValue = event.target.value
  console.log(`${event.target.id} gained focus! and, oldInputValue: ${event.target.value}`);
}

// 因为凡是焦点更换，必然右侧图片也要刷新 。为了便于整合 input 焦点更新 和 右侧图片随之更新，专门用一个函数来处理. 
function ChangeInputFocus(InputElementFocus) {
  // 1. 更新 input focus
  InputElementFocus.focus();
  // 2. 更新 右侧图片
  // console.log(filesPathDom.innerText + "\\" + InputElementFocus.value)
  const NewImageFallPath = filesPathDom.innerText + "\\" + InputElementFocus.value
  updateImg(NewImageFallPath)
}

function NextInputFocus(currentInput) {
  // console.log(`现在 imglistDOM 是： `, imgListDom)
  // const nextInput = imgListDom.children[CurrentInputIndex + 1];
  const nextInput = currentInput.nextElementSibling;
  // console.log(`下一个 input 是: `, nextInput)
  if (nextInput) {
    ChangeInputFocus(nextInput);
  }
}

async function handleKeyDown(event) {
  let currentInput = event.target
  if (event.key === 'Enter') {
    event.preventDefault()
    const inputId = currentInput.id;
    // const inputValue = currentInput
    // console.log(`${inputId} haved get keydown`, currentInput);
    let currentInputValue = currentInput.value;
    // 整理出完整路径
    const fallPathName = filesPathDom.innerText + currentInput.value;
    console.log(`${inputId} haved change currentInputValue:`, currentInputValue)

    /* 给主线程发送请求 */
    const ImageData = [filesPathDom.innerText, oldInputValue, currentInputValue]
    await window.api.changeImgNameAPI(ImageData, (backImgNewName) => {
      console.log(`当前修改的 element 是${currentInput}`,`主进程返回的新图片名称是:`, backImgNewName)
      currentInput.value = backImgNewName
      // console.log(`当前input是`, parseInt(currentInput.getAttribute('index')))
      NextInputFocus(currentInput)
    })

    // console.log(`尝试拿到 index `, currentInput.getAttribute('index'));
  }
}

function updateFilesList(filesList) {
  imgListDom.innerHTML = '';
  
  filesList.forEach((item, index) => {
    let imgPathInputElement = document.createElement('input')
    imgPathInputElement.value = item;
    imgPathInputElement.id = `input-${index + 1}`;
    imgPathInputElement.setAttribute('index', index);
    // 获取焦点时候，保存旧的 input.value
    imgPathInputElement.addEventListener('focus', handleInputFocus)
    imgPathInputElement.addEventListener('keydown', handleKeyDown);

    imgListDom.appendChild(imgPathInputElement)
  })
  // 更新图片路径 p 标签
  // filesList.forEach(item => {
  //   let pElement = document.createElement('p')
  //   pElement.innerHTML = item
  //   imgListDom.appendChild(pElement)
  // })
}

/** 参数 图片完整路径  */
function updateImg(imgFallPath) {
  imgDom.src = imgFallPath;
}

window.addEventListener('DOMContentLoaded',  () => {

  selectBtn.addEventListener('click', async () => {
    // console.log(`elect 点击了`, window.api)
    await window.api.selectFilesDialog( (filesResult) => {
      console.log(`renderer拿到的文件列表是`, filesResult)
      const filePath = filesResult[0]
      filesPathDom.innerText = filePath;
      
      updateFilesList(filesResult[1])
    })
  })

  changeBtnDom.addEventListener('click', async () => {
    await window.api.selectImgDialog( (imgFallPath) => {
      console.log(`render拿到的图片路径是`, imgFallPath)
      updateImg(imgFallPath)
    })
  })

})



