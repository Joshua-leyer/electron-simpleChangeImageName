const spanDom = document.querySelector('span');
const imgListDom = document.querySelector('#file-list');
const changeBtnDom = document.querySelector('#changeImgBtn');
const selectFolderBtnDom = document.querySelector('#selectFolderBtn');
const imgDom = document.querySelector('#now-img');
const filesPathDom = document.querySelector('#files-path');


let oldInputValue = '';

// 获取焦点做两件事：1.保存当前input内容到oldInputValue ; 2.修改右侧图片为当前 focus 的 input
function handleInputFocus(event) {
  // 1. 保存旧名称
  let currentInput = event.target;
  oldInputValue = currentInput.value;
  console.log(`获取焦点 input 执行 focus 函数： `, currentInput)
  // console.log(`${event.target.id} gained focus! and, oldInputValue: ${event.target.value}`);
  // 2. 修改右侧图片
  changeInputFocus(event.target)
}

// 因为凡是焦点更换，必然右侧图片也要刷新 。为了便于整合 input 焦点更新 和 右侧图片随之更新，专门用一个函数来处理. 
function changeInputFocus(getFocusInput) {
  if (getFocusInput === null) return
  //  更新 右侧图片
  // console.log(filesPathDom.innerText + "\\" + getFocusInput.value)
  let Extension = getFocusInput.nextElementSibling.textContent;
  const NewImageFallPath = filesPathDom.innerText + "\\" + getFocusInput.value + Extension
  updateImg(NewImageFallPath)
}

/** 更新修改右侧展示的图片 参数: [图片完整路径] 。 */
function updateImg(imgFallPath) {
  imgDom.src = imgFallPath;
}

// 整理名称，拆分出后缀
function SortName(ImageName) {
  let imagename = '';
  let imageExtension = '';
  let parts = ImageName.split('.')
  // console.log(`parts is `, parts)
  if (parts.length === 1) {
    imagename = parts[0]
    imageExtension = ''
  } else {
    imagename = parts.slice(0, parts.length - 1).join('.');  // 用 . 把前面的所有数组元素拼接起来
    imageExtension = parts.pop();   // 获取 parts 最后一个元素
  }
  return {
    imagename,
    imageExtension
  }
}

async function handleKeyAndSwitch(event) {
  let currentInput = event.target
  let inputId = currentInput.id;
  // 使用正则表达式提取数字部分
  const numberPart = Number(inputId.match(/\d+$/)[0]);
  // console.log(`currentInput 是`, currentInput, `当前input的id数字部分`, numberPart)
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    switch (event.key) {
      case 'ArrowUp':
        currentInput.value = oldInputValue
        let previousInput = document.getElementById(`input-${numberPart - 1}`)
        if (previousInput) previousInput.focus();
        break;
      case 'ArrowDown':
        currentInput.value = oldInputValue
        let nextInput = document.getElementById(`input-${numberPart + 1}`)
        if (nextInput) nextInput.focus();
        break;
    }
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    // const inputValue = currentInput
    // console.log(`${inputId} haved get keydown`, currentInput);
    let currentInputValue = currentInput.value;
    let Extension = currentInput.nextElementSibling.textContent;
    console.log(`${inputId} haved change currentInputValue:`, currentInputValue)
    /* 给主线程发送请求 */
    const ImageData = {
      ImagePath: filesPathDom.innerText,
      oldInputValue: oldInputValue + Extension,
      currentInputValue: currentInputValue + Extension
    }
    await window.api.changeImgNameAPI(ImageData, (backImgNewName) => {
      console.log(`当前修改的 input 是${currentInput}`,`主进程返回的新图片名称是:`, backImgNewName)
      let { imagename, imageExtension} = SortName(backImgNewName)
      currentInput.value = imagename
    })
    // let NextInput = document.getElementById(`input-${numberPart + 1}`);
    // if (nextInput) NextInput.focus();
    document.getElementById(`input-${numberPart + 1}`)?.focus();
  }
}



// 更新imgsNameList DOM
function updateFilesList(filesList) {
  imgListDom.innerHTML = '';
  
  filesList.forEach((item, index) => {
    // let filename = ''
    // let imageExtension = ''
    let ImgageNameElement = document.createElement('div')
    let imgPathInputElement = document.createElement('input')
    let imageNameExtensionElement = document.createElement('b')

    ImgageNameElement.classList.add('image-path')
    imgPathInputElement.classList.add('child-left')
    imageNameExtensionElement.classList.add('child-right', 'name-extension')
    let {imagename, imageExtension} = SortName(item)
    // 名称
    imgPathInputElement.value = imagename;
    imgPathInputElement.id = `input-${index + 1}`;
    // 后缀
    imageNameExtensionElement.textContent = `.${imageExtension}`
    // div父元素添加 index ，方便跟踪索引
    ImgageNameElement.setAttribute('index', index + 1); 
    
    ImgageNameElement.appendChild(imgPathInputElement)
    ImgageNameElement.appendChild(imageNameExtensionElement)

    imgListDom.appendChild(ImgageNameElement)

 
    imgPathInputElement.addEventListener('focus', handleInputFocus)
    // imgPathInputElement.addEventListener('keydown', handleKeyDown);
  })
  // 想通过给父元素添加 focus 事件 好像不行
  // imgListDom.addEventListener('focus', (event) => {
  //   console.log(`焦点 dom 是`, event.target)
  // })

  imgListDom.addEventListener('keydown', handleKeyAndSwitch)
}


window.addEventListener('DOMContentLoaded',  () => {
  // 选择文件夹
  selectFolderBtnDom.addEventListener('click', async () => {
    console.log(`elect 点击了`, window.api)
    await window.api.selectFilesDialog( (filesResult) => {
      console.log(`选择文件夹, renderer拿到的文件列表是`, filesResult)
      let {folderPath, filesList} = filesResult
      filesPathDom.innerText = folderPath;

      updateFilesList(filesList)
    })
  })

  // changeBtnDom.addEventListener('click', async () => {
  //   await window.api.selectImgDialog( (imgFallPath) => {
  //     console.log(`render拿到的图片路径是`, imgFallPath)
  //     updateImg(imgFallPath)
  //   })
  // })

})



