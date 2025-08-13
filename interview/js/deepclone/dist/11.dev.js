"use strict";

var arr = [1, 2, 3];
var newArr = [].concat(arr);
var arr2 = arr.slice();
arr2[1] = 'b';
console.log(arr2, arr);
var arr3 = [[1, 2], [3, 4], [5, [6, 7]]];
var arr4 = arr3.slice();
arr4[2][1][1] = 8;
console.log(arr4, arr3);
var arr5 = arr3.concat();