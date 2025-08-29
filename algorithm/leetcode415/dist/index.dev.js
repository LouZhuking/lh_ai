"use strict";

/**
 * 字符串相加函数
 * 将两个表示非负整数的字符串相加，返回它们的和（也以字符串形式表示）
 * @param {string} num1 - 第一个数字字符串
 * @param {string} num2 - 第二个数字字符串
 * @return {string} - 两数相加的结果字符串
 */
var addStrings = function addStrings(num1, num2) {
  // 创建一个字符串构建器（在JavaScript中使用数组模拟，但这里直接使用字符串）
  // 用于存储计算结果，初始为空字符串
  var res = ""; // 初始化两个指针，分别指向两个字符串的末尾（即个位数）

  var i = num1.length - 1;
  var j = num2.length - 1; // 进位值，初始为0

  var carry = 0; // 当至少还有一个字符串没有处理完时，继续循环

  while (i >= 0 || j >= 0) {
    // 从右向左逐位读取数字
    // 如果指针i仍在字符串num1范围内，则取对应字符转换为数字，否则为0（相当于补0）
    var n1 = i >= 0 ? parseInt(num1.charAt(i)) : 0; // 如果指针j仍在字符串num2范围内，则取对应字符转换为数字，否则为0（相当于补0）

    var n2 = j >= 0 ? parseInt(num2.charAt(j)) : 0; // 计算当前位的和，包括两个数字和上一位的进位

    var tmp = n1 + n2 + carry; // 计算新的进位值（除以10的商）

    carry = Math.floor(tmp / 10); // 将当前位的结果（除以10的余数）添加到结果字符串中
    // 注意：这里是从低位到高位依次添加

    res += tmp % 10; // 指针向前移动（向左移动，处理更高一位）

    i--;
    j--;
  } // 如果最后还有进位（carry为1），则在结果末尾添加1
  // （注意：此时结果是倒序的，所以添加在末尾相当于最高位）


  if (carry == 1) res += "1"; // 由于我们是从低位到高位构建字符串的，所以需要将结果反转
  // 最后转换为字符串返回

  return res.split("").reverse().join("");
};