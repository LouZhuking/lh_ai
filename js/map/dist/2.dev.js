"use strict";

// parseInt num 
['1', '2', '3'].map(function (num, index, arr) {
  console.log(num, index, arr);
  return num;
}); // 第二个参数是进制

console.log(parseInt('1', 0, ['1', '2', '3'])); // 10进制

console.log(parseInt('2', 1, ['1', '2', '3'])); // 基数1是无效进制

console.log(parseInt('3', 2, ['1', '2', '3'])); // 2进制大 '3'不是有效数