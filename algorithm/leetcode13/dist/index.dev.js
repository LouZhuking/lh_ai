"use strict";

// 定义罗马数字转整数的函数
var romanToInt = function romanToInt(s) {
  // 创建Map存储罗马数字与对应数值的映射关系
  var symbolValues = new Map();
  symbolValues.set('I', 1); // I = 1

  symbolValues.set('V', 5); // V = 5

  symbolValues.set('X', 10); // X = 10

  symbolValues.set('L', 50); // L = 50

  symbolValues.set('C', 100); // C = 100

  symbolValues.set('D', 500); // D = 500

  symbolValues.set('M', 1000); // M = 1000

  var ans = 0; // 初始化结果为0

  var n = s.length; // 获取输入字符串长度
  // 遍历每个罗马数字字符

  for (var i = 0; i < n; ++i) {
    var value = symbolValues.get(s[i]); // 获取当前字符对应的数值
    // 检查是否是特殊情况（当前数字小于右边数字时需减去当前值）

    if (i < n - 1 && value < symbolValues.get(s[i + 1])) {
      ans -= value; // 减去当前值（如IV=4，IX=9等情况）
    } else {
      ans += value; // 否则正常累加
    }
  }

  return ans; // 返回最终结果
};