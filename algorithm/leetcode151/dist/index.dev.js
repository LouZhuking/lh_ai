"use strict";

/**
 * @param {string} s
 * @return {string}
 */
var s = "the sky is blue";

var reverseWords = function reverseWords(s) {
  // 1.先将字符串转为数组
  var strArr = Array.from(s); // 2. 删除多余空行

  removeExtraSpaces(strArr); //  3. 反转数组

  reverse(strArr, 0, strArr.length - 1); //  4. 反转单词

  var start = 0;

  for (var i = 0; i <= strArr.length; i++) {
    if (strArr[i] === ' ' || i === strArr.length) {
      reverse(strArr, start, i - 1);
      start = i + 1;
      console.log(strArr);
    }
  }

  return strArr.join('');
}; // 移除数组中多余空格


function removeExtraSpaces(strArr) {
  var slowIndex = 0;
  var fastIndex = 0; // 删除开始位置和重复的空行

  while (fastIndex < strArr.length) {
    if (strArr[fastIndex] === ' ' && (fastIndex === 0 || strArr[fastIndex - 1] === ' ')) {
      fastIndex++;
    } else {
      strArr[slowIndex] = strArr[fastIndex];
      slowIndex++;
      fastIndex++;
    }
  } // 删除末尾空行


  strArr.length = strArr[slowIndex - 1] === ' ' ? slowIndex - 1 : slowIndex;
} // 反转 从 start 到 end 的单词


function reverse(strArr, start, end) {
  var left = start;
  var right = end;

  while (left < right) {
    var _ref = [strArr[right], strArr[left]];
    strArr[left] = _ref[0];
    strArr[right] = _ref[1];
    left++;
    right--;
  }
}

console.log(reverseWords(s));