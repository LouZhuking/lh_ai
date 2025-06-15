"use strict";

// 为什么要用自执行函数？
// 放在函数头部先进性判断 
var whichEvent = function () {
  if (window.addEventListener) {
    return function (element, type, listener, useCapture) {
      element.addEventListener(type, listener, useCapture);
    };
  }
}();