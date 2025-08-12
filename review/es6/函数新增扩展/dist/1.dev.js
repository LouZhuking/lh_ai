"use strict";

var x = 1;

function f() {
  var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : x;
  return function () {
    // 等同于 let y = x  
    var x = 2;
    console.log(y);
    console.log(x);
  }();
}

f(); // 1 2