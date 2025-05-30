"use strict";

function bar() {
  var myName = "极客世界";
  var test1 = 100;

  if (1) {
    var _myName = "Chrome浏览器";
    console.log(test); // 1
  }
}

function foo() {
  var myName = "极客邦";
  var test = 2;
  {
    // 花括号 创建 块级作用域
    var _test = 3;
    bar(); // 跳出 foo 函数， 执行 bar 函数
  }
}

var myName = "极客时间";
var myAge = 10;
var test = 1;
foo(); //