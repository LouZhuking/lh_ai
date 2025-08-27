"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// 向Function.prototype添加自定义的myApply方法
// context: 函数执行时的上下文对象，即this指向
// args: 函数执行时传递的参数数组或类数组
Function.prototype.myApply = function (context, args) {
  var _context;

  // 类型检查：确保调用myApply的对象是一个函数
  if (typeof this !== 'function') {
    throw new TypeError('Type Error');
  } // 如果context为null或undefined，将其设置为全局对象
  // 在浏览器中globalThis指向window，在Node.js中指向global


  if (context === null || context === undefined) {
    context = globalThis;
  } // 创建一个唯一的Symbol作为属性名，避免污染原对象


  var fn = Symbol(''); // 将当前函数(this)作为context对象的一个临时方法

  context[fn] = this; // 调用这个临时方法，并传入args数组中的参数
  // 使用扩展运算符(...)将数组展开为多个参数

  var res = (_context = context)[fn].apply(_context, _toConsumableArray(args)); // 删除临时添加的方法，清理context对象


  delete context[fn]; // 返回函数调用的结果

  return res;
};

Function.prototype.myBind = function (context) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (typeof this !== 'function') {
    throw new TypeError('Type Error');
  }

  if (context === null || context === undefined) {
    context = globalThis;
  }

  fn1 = this;

  function fn2() {
    for (var _len2 = arguments.length, Args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      Args[_key2] = arguments[_key2];
    }

    if (this instanceof fn2) {
      var _fn;

      return (_fn = fn1).call.apply(_fn, [this].concat(args, Args));
    } else {
      var _fn2;

      return (_fn2 = fn1).call.apply(_fn2, [context].concat(args, Args));
    }
  }

  fn2.prototype = Object.create(this.prototype);
  return fn2;
};