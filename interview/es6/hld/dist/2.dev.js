"use strict";

var sleep = function sleep(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};

function trafficLight(params) {
  var seq, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, color, time;

  return regeneratorRuntime.async(function trafficLight$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          seq = [{
            color: 'red',
            time: 1000
          }, {
            color: 'green',
            time: 2000
          }, {
            color: 'yellow',
            time: 3000
          }];

        case 1:
          if (!true) {
            _context.next = 31;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 5;
          _iterator = seq[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 15;
            break;
          }

          _step$value = _step.value, color = _step$value.color, time = _step$value.time;
          console.log(color);
          _context.next = 12;
          return regeneratorRuntime.awrap(sleep(time));

        case 12:
          _iteratorNormalCompletion = true;
          _context.next = 7;
          break;

        case 15:
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 21:
          _context.prev = 21;
          _context.prev = 22;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 24:
          _context.prev = 24;

          if (!_didIteratorError) {
            _context.next = 27;
            break;
          }

          throw _iteratorError;

        case 27:
          return _context.finish(24);

        case 28:
          return _context.finish(21);

        case 29:
          _context.next = 1;
          break;

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 17, 21, 29], [22,, 24, 28]]);
}

trafficLight();