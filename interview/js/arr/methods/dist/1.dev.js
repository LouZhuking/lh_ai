"use strict";

var arr = [1, 2, 3, 4, 5]; // const removed = arr.splice(2,2); // 4 5
// console.log(removed);   // 3 , 4
// console.log(arr);     // 1, 2 , 5
// slice 不修改数组，截取部分
// slice + concat 进行拼接

var a = arr.slice(4);
var newArr = arr.slice(0, 2).concat(arr.slice(4));
console.log(newArr);
console.log(arr);
console.log(a);