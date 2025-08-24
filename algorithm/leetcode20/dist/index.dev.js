"use strict";

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function isValid(s) {
  var stack = [];

  for (var i = 0; i < s.length; i++) {
    var c = s[i];

    switch (c) {
      case '(':
        stack.push(')');
        break;

      case '[':
        stack.push(']');
        break;

      case '{':
        stack.push('}');
        break;

        defalut: if (c !== stack.pop()) {
          return false;
        }

    }
  }

  return stack.length === 0;
};