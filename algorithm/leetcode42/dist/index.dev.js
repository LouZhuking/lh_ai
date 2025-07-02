"use strict";

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function trap(height) {
  // 定义数组的长度防止多次复用
  var n = height.length; // 定义前缀最大值的数组

  var pre_max = new Array(n).fill(0); // 定义后缀最大值的数组

  var suf_max = new Array(n).fill(0);
  pre_max[0] = height[0];
  suf_max[n - 1] = height[n - 1]; // 判断前缀数组当中元素与块状高度取最大值

  for (var i = 1; i <= n; i++) {
    pre_max[i] = Math.max(pre_max[i - 1], height[i]);
  } // 判断后缀数组当中元素与块状高度取最大值


  for (var _i = n - 2; _i >= 0; _i--) {
    suf_max[_i] = Math.max(suf_max[_i + 1], height[_i]);
  } // 判断同数组元素下per_max和suf_max的最小值减去height[i]


  var ans = 0;

  for (var _i2 = 0; _i2 < n; _i2++) {
    ans += Math.min(pre_max[_i2], suf_max[_i2]) - height[_i2];
  }

  return ans;
};