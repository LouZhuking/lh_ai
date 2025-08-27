"use strict";

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(idGenerator);

// 生成器函数
// async 更好理解
// 函数内部有异步任务, 可以控制执行流程 
function idGenerator() {
  var id;
  return regeneratorRuntime.wrap(function idGenerator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = 1;

        case 1:
          if (!(id < 4)) {
            _context.next = 6;
            break;
          }

          _context.next = 4;
          return id++;

        case 4:
          _context.next = 1;
          break;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
} // es8 async/await es6 * + yeild  暂停


var gen = idGenerator(); // 迭代器

console.log(gen.next().value);
console.log(gen.next().value, gen.next().done);
console.log(gen.next().value, gen.next().done);
console.log(gen.next().done);