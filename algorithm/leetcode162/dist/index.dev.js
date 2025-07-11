"use strict";

/**
 * @param {number[]} nums
 * @return {number}
 */
// 这是一个JSDoc注释，用于说明函数的参数和返回值类型。
// @param {number[]} nums 表示函数接收一个数字数组作为参数。
// @return {number} 表示函数返回一个数字。
var findPeakElement = function findPeakElement(nums) {
  // 定义一个名为 findPeakElement 的函数，接收一个数组 nums 作为参数，用于查找数组中的峰值元素索引。
  // [0,n-2], 实际为(-1,n-1)
  var n = nums.length; // 获取数组 nums 的长度，并将其存储在常量 n 中。
  // 定义左指针为-1，右指针为 n-1

  var left = -1,
      right = n - 1; // 初始化两个指针，left 为 -1，right 为数组最后一个元素的索引，用于二分查找。

  while (left + 1 < right) {
    // 当 left 指针加 1 小于 right 指针时，继续循环，这是二分查找的循环条件。
    var mid = Math.floor((left + right) / 2); // 计算 left 和 right 指针的中间位置，并向下取整得到 mid 指针。注意：此处缺少 `let` 或 `var` 声明，会隐式创建全局变量。

    if (nums[mid] > nums[mid + 1]) {
      // 如果中间位置的元素大于其后一个元素，说明峰值在左半部分。
      right = mid; // 将 right 指针移动到 mid 位置，缩小右半部分的搜索范围。
    } else {
      // 否则，说明峰值在右半部分。
      left = mid; // 将 left 指针移动到 mid 位置，缩小左半部分的搜索范围。
    }
  }

  return right; // 循环结束后，right 指针指向的位置即为峰值元素的索引，返回该索引。
}; // 原代码中此处缺少分号，现已补充