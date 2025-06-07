"use strict";

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function removeDuplicates(nums) {
  var n = nums.length;
  if (n === 0) return 0;
  var fast = 1,
      slow = 1;

  while (fast < n) {
    if (nums[fast] !== nums[fast - 1]) {
      nums[slow] = nums[fast];
      ++slow;
    }

    ++fast;
  }

  return slow;
};