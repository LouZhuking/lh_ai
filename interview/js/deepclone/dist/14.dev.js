"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var target = {
  field1: 1,
  field2: undefined,
  field3: 'hxt',
  field4: {
    child: 'child',
    child2: {
      child2: 'child2'
    }
  },
  field5: [1, 2, 3]
};
target.target = target; // 循环引用
// es6 的新数据类型 hash Map

function clone(target) {
  var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();

  if (_typeof(target) === 'object') {
    var cloneTarget = Array.isArray(target) ? [] : {};

    for (var key in target) {
      cloneTarget[key] = clone(target[key]);
    }

    return cloneTarget;
  } else {
    return target;
  }
}