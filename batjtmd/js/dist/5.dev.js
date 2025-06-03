"use strict";

// 全局作用域
function fn() {
  // 函数作用域
  var a = 2;

  if (true) {
    // 支持块级作用域 (高级语言的特性) var 不支持块级作用域
    var b = 3;
  }

  console.log(b);
}

fn();

if (false) {
  var _value = 1; // 块级作用域
} // 在全局找不到


console.log(value);