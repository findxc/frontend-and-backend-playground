let timeoutId

const msgEle = document.getElementById('msg')

// 显示提示信息
function showMsg(text, type) {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  msgEle.innerText = text
  msgEle.style.background = type === 'error' ? 'lightcoral' : 'lightblue'
  msgEle.style.opacity = 1

  // 1.5s 后自动隐藏
  timeoutId = setTimeout(() => {
    msgEle.style.opacity = 0
    timeoutId = undefined
  }, 1500)
}
