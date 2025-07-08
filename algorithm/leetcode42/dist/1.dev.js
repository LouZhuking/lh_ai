"use strict";

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function trap(height) {
  // 定义数组的长度  
  var n = height.length; // 定义容器容纳度

  var ans = 0; // 定义左右指针

  var left = 0,
      right = n - 1; // 定义前缀最大值和后缀最大值

  var pre_max = 0,
      suf_max = 0;

  while (left < right) {
    pre_max = Math.max(pre_max, height[left]);
    suf_max = Math.max(suf_max, height[right]);

    if (pre_max <= suf_max) {
      ans += pre_max - height[left];
      left++;
    } else {
      ans += suf_max - height[right];
      right--;
    }
  }

  return ans;
};