"use strict";

// 代码 编译阶段， 执行阶段
// 当前作用域的顶部
// 变量提升是面试官喜欢的，  js开发者设计的
// 不好，代码的执行结果和代码阅读顺序不一致， 有歧义
// 糟粕，避开
// 申明变量不在使用 var ， 用 let
showName(); // 驼峰式命名

console.log(myName);
var myName = '曾欣';

function showName() {
  var myName = 'zhangsan';
  console.log(myName);
}