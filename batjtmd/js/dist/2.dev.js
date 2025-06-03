"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var arr = ['1', '2', '3'];
console.log(_typeof(arr));
var date = new Date();
console.log(_typeof(date)); // 如何区分Object 的这些类型？
// [object Array]
// [object Date]

console.log(Object.prototype.toString.call(arr));
console.log(Object.prototype.toString.call(date)); // 会在MDN 文档上看一些资料

function getType(value) {
  // string api 的选择
  // split + substring
  return Object.prototype.toString.call(arr).slice(8, -1);
}