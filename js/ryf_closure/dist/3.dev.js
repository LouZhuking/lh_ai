"use strict";

function f1() {
  var n = 999;

  nAdd = function nAdd() {
    n += 1;
  };

  function f2() {
    console.log(n);
  }

  return f2;
}

var result = f1();
result();
nAdd();
result();