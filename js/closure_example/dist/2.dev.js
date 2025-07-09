"use strict";

function debounce(fn, delay) {
  // 
  var id = null;
  return function (args) {
    // 定时器返回ID
    // fn 自由变量
    // fn 对象 函数也是对象 是一等对象
    clearTimeout(fn.id);
    fn.id = setTimeout(function () {
      fn(args);
    }, delay);
  };
} // debounce 高阶函数 对函数做高阶限制


var obj = {
  count: 0,
  inc: debounce(function (val) {
    // this 
    console.log(this);
    this.count += val;
  }, 500)
};
obj.inc(2);