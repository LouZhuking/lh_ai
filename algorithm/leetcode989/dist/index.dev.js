"use strict";

/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function addToArrayForm(num, k) {
  var res = [];
  var n = num.length - 1;

  for (var i = n; i >= 0; --i) {
    var sum = num[i] + k % 10;
    k = Math.floor(k / 10);
    console.log(sum);

    if (sum >= 10) {
      k++;
      sum -= 10;
    }

    res.push(sum);
  }

  for (; k > 0; k = Math.floor(k / 10)) {
    res.push(k % 10);
  }

  res.reverse();
  return res;
};

var num = [1, 2, 0, 0];
addToArrayForm(num, 34);