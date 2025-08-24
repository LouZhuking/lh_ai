"use strict";

/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicates = function removeDuplicates(s) {
  var stack = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = s[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;

      if (i === stack[stack.length - 1]) {
        stack.pop();
      } else {
        stack.push(i);
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

  return stack.join("");
};

console.log(removeDuplicates("abbaca"));