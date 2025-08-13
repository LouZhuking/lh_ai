"use strict";

var obj1 = {
  name: '张三',
  age: 20
};
var obj2 = obj1; // 没有实现拷贝
// 不是复印, 引用传递。 只是换个名字，还是一个东西 

obj2.age = 99;
var arr1 = [1, 2, 3];
var arr2 = arr1;
arr2.push(4);