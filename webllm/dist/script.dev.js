"use strict";

// DOM 元素获取
var triggerBtn = document.getElementById('triggerBtn');
var desc = document.getElementById('desc'); // 按钮点击事件处理

triggerBtn.addEventListener('click', function () {
  desc.textContent = '交互已触发！当前时间：' + new Date().toLocaleTimeString();
  desc.style.color = '#e17055';
  triggerBtn.textContent = '已触发';
}); // 页面加载完成事件

window.addEventListener('load', function () {
  console.log('WebLLM 项目页面加载完成');
  desc.textContent += '（页面已加载）';
});