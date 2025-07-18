"use strict";

// 如何遍历数组
// - for (let i = 0...) 计数循环 性能好  可读性不好 不是人脑， 电脑
// - while
// - forEach
// - map filter find some every
// - for of 
// forEach 当中， 可以return ， 但是不能break和continue
var names = Array.of('Alice', 'Bob', 'Charlie', 'Jerry'); // console.log(names);

names.forEach(function (name) {
  if (name === 'Jerry') {
    console.log("Charlie is here, stop...."); // break;

    return;
  }

  console.log('Processing:' + name);
});