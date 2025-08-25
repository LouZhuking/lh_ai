"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

console.log(_typeof(2)); // number

console.log(_typeof(true)); // boolean

console.log(_typeof('str')); // string

console.log(_typeof([])); // object    

console.log(_typeof(function () {})); // function

console.log(_typeof({})); // object

console.log(typeof undefined === "undefined" ? "undefined" : _typeof(undefined)); // undefined

console.log(_typeof(null)); // object

console.log(typeof NaN === "undefined" ? "undefined" : _typeof(NaN)); // number