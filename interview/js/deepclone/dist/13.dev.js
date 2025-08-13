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
  }
}; // console.log(JSON.parse(JSON.stringify(target)));

function clone(source) {
  if (_typeof(source) === 'object') {
    var cloneTarget = {}; // 分配新空间

    for (var key in source) {
      // 遍历
      cloneTarget[key] = clone(source[key]); // 递归
    }

    return cloneTarget;
  } else {
    return source;
  }
}

var obj = clone(target);
obj.field4.child = 'objchild';
console.log(obj, target);