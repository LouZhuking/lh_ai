/**
 * @desc 也米娜背景切换
 * @author lh
 * @date 2025-05-10 20:29:52
 */
// JS面向对象 语言
// 事件监听
// 弹窗加载完成后执行
// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 获取改变颜色的按钮元素
  const changeColorButton = document.getElementById('changeColor');
  
  // 为按钮添加点击事件监听器
  changeColorButton.addEventListener('click', async () => {
    // 获取当前活动标签页
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 在当前标签页中执行脚本
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: changeBackgroundColor
    });
  });
});

// 将背景颜色改为绿色的函数
function changeBackgroundColor() {
  document.body.style.backgroundColor = '#0098FF';
} 