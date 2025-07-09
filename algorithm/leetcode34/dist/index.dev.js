"use strict";

var binarySearch = function binarySearch(nums, target, lower) {
  var left = 0,
      right = nums.length - 1,
      ans = nums.length;

  while (left <= right) {
    var mid = Math.floor((left + right) / 2);

    if (nums[mid] > target || lower && nums[mid] >= target) {
      right = mid - 1;
      ans = mid;
    } else {
      left = mid + 1;
    }
  }

  return ans;
};

var searchRange = function searchRange(nums, target) {
  var ans = [-1, -1];
  var leftIdx = binarySearch(nums, target, true);
  var rightIdx = binarySearch(nums, target, false) - 1;

  if (leftIdx <= rightIdx && rightIdx < nums.length && nums[leftIdx] === target && nums[rightIdx] === target) {
    ans = [leftIdx, rightIdx];
  }

  return ans;
};