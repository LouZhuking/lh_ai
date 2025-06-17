"use strict";

// 自顶向下f(n) -> f(n-1) + f(n-2)-> 画树形结构 (方程不明显，有利于推到)
var climbStairs = function climbStairs(n) {
  // 基本情况：n为0或1时，只有一种方法（不爬或爬一步）
  if (n === 1) return 1;
  if (n === 2) return 2; // 递归计算：将问题分解为子问题，分别计算f(n-1)和f(n-2)的方法数

  return climbStairs(n - 1) + climbStairs(n - 2);
};