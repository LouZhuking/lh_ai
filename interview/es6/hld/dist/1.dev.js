"use strict";

// # 红绿灯
// - 同步阻塞
// sleep 函数
// - 显示时间
// - 轮询
var sleep = function sleep(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};

(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('begin'); // 异步变同步

          _context.next = 3;
          return regeneratorRuntime.awrap(sleep(2000));

        case 3:
          console.log('end');

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
})();