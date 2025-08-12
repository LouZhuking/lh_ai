"use strict";

/**
 * 扩展运算符应用
 */
function push(array) {
  for (var _len = arguments.length, items = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    items[_key - 1] = arguments[_key];
  }

  array.push.apply(array, items);
}

var arr = [1, 2, 3];
push(arr, 4, 5, 6);
console.log(arr); // [1, 2, 3, 4, 5, 6]

function add(a, b) {
  return a + b;
}

var numbers = [10, 27];
add.apply(void 0, numbers);
console.log(add.apply(void 0, numbers));