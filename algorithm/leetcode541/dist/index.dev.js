"use strict";

/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function reverseStr(s, k) {
  // 1. 拿到数组字符串的长度
  var len = s.length; // 2. 将交换的数据存储起来

  var resArr = s.split(""); //  3. 开始循环遍历数组当中以2k开始遍历

  for (var i = 0; i < len; i += 2 * k) {
    // 4. 判断交换条件确定交换函数的左指针位置
    var l = i - 1,
        r = i + k > len ? len : i + k; // console.log(l,r);

    while (++l < --r) {
      var _ref = [resArr[r], resArr[l]];
      resArr[l] = _ref[0];
      resArr[r] = _ref[1];
    }
  } // 5. 最后将数组转换为字符串返回


  return resArr.join("");
};

console.log(reverseStr("abcdefg", 2));