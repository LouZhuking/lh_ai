// DOM 元素获取
const triggerBtn = document.getElementById('triggerBtn');
const desc = document.getElementById('desc');

// 按钮点击事件处理
triggerBtn.addEventListener('click', () => {
    desc.textContent = '交互已触发！当前时间：' + new Date().toLocaleTimeString();
    desc.style.color = '#e17055';
    triggerBtn.textContent = '已触发';
});

// 页面加载完成事件
window.addEventListener('load', () => {
    console.log('WebLLM 项目页面加载完成');
    desc.textContent += '（页面已加载）';
});