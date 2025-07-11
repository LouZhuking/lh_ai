"use strict";

/**
 * @param {number[]} nums
 * @return {number}
 */
// 这是一个 JSDoc 注释，用于说明函数的参数和返回值类型。
// @param {number[]} nums 表示该函数接收一个数字数组作为参数。
// @return {number} 表示该函数返回一个数字。
var findMin = function findMin(nums) {
  // 定义一个名为 findMin 的函数，接收一个数组 nums 作为参数，用于查找旋转排序数组中的最小元素。
  var n = nums.length; // 获取输入数组 nums 的长度，并将其存储在常量 n 中。
  // 处理空数组情况

  if (n === 0) {
    return undefined;
  } // 检查数组是否为空，如果为空则返回 undefined，避免后续代码访问空数组导致错误。
  // 处理只有一个元素的情况


  if (n === 1) {
    return nums[0];
  } // 检查数组长度是否为 1，如果是则直接返回数组中的唯一元素。


  var left = 0,
      right = n - 1; // 初始化两个指针，left 指向数组的第一个元素（索引为 0），right 指向数组的最后一个元素。

  while (left + 1 < right) {
    // 当 left 指针和 right 指针之间至少间隔一个元素时，继续循环。
    var mid = Math.floor((left + right) / 2); // 计算 left 和 right 指针的中间位置，并向下取整得到 mid 指针。

    if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      left = mid;
    } // 如果中间元素小于 right 指针指向的元素，说明最小元素在左半部分，将 right 指针移动到 mid 位置。
    // 否则，说明最小元素在右半部分，将 left 指针移动到 mid 位置。

  }

  return Math.min(nums[left], nums[right]); // 循环结束后，left 和 right 指针相邻，返回它们指向元素中的较小值，即为数组中的最小元素。
}; // 函数定义结束