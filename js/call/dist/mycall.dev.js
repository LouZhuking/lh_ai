"use strict";

function greeting() {
  // console.log(args, arguments[0], arguments[1]);
  return "hello, I am ".concat(this.name, ".");
}

Function.prototype.myCall = function (context) {
  var _context;

  if (context === null || context === undefined) {
    context = window;
  }

  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.myCall called on non-function");
  }

  var fnKey = Symbol("fn");
  context[fnKey] = this;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var result = (_context = context)[fnKey].apply(_context, args);

  delete context[fnKey];
  return result;
};

var obj = {
  name: 'xww',
  fn: function fn() {}
};
console.log(greeting.myCall(obj, 1, 2, 3));