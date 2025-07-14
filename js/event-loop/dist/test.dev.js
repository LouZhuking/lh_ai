"use strict";

console.log('script start');

function async1() {
  return regeneratorRuntime.async(function async1$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(async2());

        case 2:
          console.log('async1 end');

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

function async2() {
  return regeneratorRuntime.async(function async2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('async2 end');

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

async1();
setTimeout(function () {
  console.log('setTimeout');
}, 0);
new Promise(function (resolve) {
  console.log('Promise');
  resolve();
}).then(function () {
  console.log('promise1');
}).then(function () {
  console.log('promise2');
});
console.log('script end');