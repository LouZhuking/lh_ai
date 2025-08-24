"use strict";

var a = [1, 4, 0, 10].findIndex(function (n) {
  return n < 0;
}); // 返回索引-1

console.log(a);