"use strict";

console.log('同步Start');
var promise1 = Promise.resolve('First Promise');
var promise2 = Promise.resolve('Second Promise');
var promise3 = new Promise(function (resolve) {
  resolve('Third Promise');
  console.log('promise3');
});
setTimeout(function () {
  console.log('下一把再相见');
  var Promise4 = Promise.resolve('Fourth Promise');
  Promise4.then(function (value) {
    return console.log(value);
  });
}, 0);
setTimeout(function () {
  console.log('下一把再相见');
}, 0);
promise1.then(function (value) {
  return console.log(value);
});
promise2.then(function (value) {
  return console.log(value);
});
promise3.then(function (value) {
  return console.log(value);
});
console.log('同步end');