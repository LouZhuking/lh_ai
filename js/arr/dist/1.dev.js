"use strict";

// {} key:value 0(1) HashMap Map
// 第一种重要的数据结构
// 第二种重要数据结构 链表、队列、栈
// 长度限定 、类型
// 可以、动态扩容
var arr = [1, 2, 3, 4, 5];
var arr2 = new Array(5).fill(undefined);
console.log(arr2);
arr2[8] = undefined;
console.log(arr2);

for (var key in arr2) {
  console.log(key, arr2[key]);
}

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = arr2[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _key = _step.value;
    console.log(arr2[_key]);
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
      _iterator["return"]();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}