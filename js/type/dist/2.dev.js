"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

console.log(0 / 0); // 平方根 NaN

console.log(Math.sqrt(-1)); // js 内置的Math 对象

console.log(parseInt("123"));
console.log(Number(undefined)); // NaN

console.log(NaN === NaN); // false  Not a Number 的方式不一定相等

console.log(isNaN(NaN)); // true  

console.log(typeof NaN === "undefined" ? "undefined" : _typeof(NaN)); // number 类型