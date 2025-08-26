"use strict";

var p1 = Promise.resolve('p1');
var p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('p2 延时一秒');
  }, 1000);
});
var p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('p3 延时两秒');
  }, 2000);
});
var p4 = Promise.reject('p4 rejected');
var p5 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    reject('p5 rejected 延时1秒');
  }, 1500);
});
Promise.all([p1, p2, p3]).then(function (res) {
  console.log(res);
})["catch"](function (err) {
  return console.log(err);
});