"use strict";

var arr = new Array(5); // console.log(arr[0]);

console.log(arr.hasOwnProperty(0));
var obj = {
  name: 'xww'
};
var obj2 = {
  skill: 'js'
};
obj.__proto__ = obj2;
console.log(obj.skill);

for (var key in obj) {
  console.log(obj[key]);
}

console.log(arr.hasOwnProperty(0));