"use strict";

// 语法糖
function foo() {
  var a;
  return regeneratorRuntime.async(function foo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bar());

        case 2:
          a = _context.sent;
          return _context.abrupt("return", a + 1);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}