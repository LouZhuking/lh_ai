"use strict";

/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function evalRPN(tokens) {
  var stack = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var token = _step.value;

      if (isNaN(Number(token))) {
        var n2 = stack.pop();
        var n1 = stack.pop();

        switch (token) {
          case "+":
            stack.push(n1 + n2);
            break;

          case "-":
            stack.push(n1 - n2);
            break;

          case "*":
            stack.push(n1 * n2);
            break;

          case "/":
            stack.push(n1 / n2 | 0);
            break;
        }
      } else {
        stack.push(Number(token));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return stack[0];
};