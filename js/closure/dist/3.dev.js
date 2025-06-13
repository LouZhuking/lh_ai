"use strict";

function add() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  console.log(args);
  return function () {
    for (var _len2 = arguments.length, newArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      newArgs[_key2] = arguments[_key2];
    }

    var arr = [].concat(args, newArgs);
    console.log(arr);
  };
}

add(1, 2, 3)(4, 5, 6);