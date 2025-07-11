"use strict";

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function search(nums, target) {
  var n = nums.length;

  if (n === 0) {
    return -1;
  }

  var left = 0,
      right = n - 1;

  while (left + 1 < right) {
    var mid = Math.floor((left + right) / 2);

    if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      left = mid;
    }
  }

  var minIndex = nums[left] < nums[right] ? left : right;
  nums = nums.slice(minIndex).concat(nums.slice(0, minIndex));
  left = 0, right = n - 1;

  while (left + 1 < right) {
    var _mid = Math.floor((left + right) / 2);

    if (nums[_mid] < target) {
      left = _mid;
    } else {
      right = _mid;
    }
  }

  return nums[left] === target ? left : nums[right] === target ? right : -1;
};