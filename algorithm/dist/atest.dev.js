"use strict";

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function addStrings(num1, num2) {
  var res = "";
  var i = num1.length - 1;
  var j = num2.length - 1;
  var carry = 0;

  while (i >= 0 || j >= 0 || carry > 0) {
    var n1 = i >= 0 ? parseInt(num1.charAt(i)) : 0;
    var n2 = j >= 0 ? parseInt(num1.charAt(j)) : 0;
    var temp = n1 + n2 + carry;
    carry = Math.floor(temp / 10);
    res += temp % 10;
    i--;
    j--;
  }

  if (carry == 1) res += "1";
  return res.split("").reverse().join("");
};