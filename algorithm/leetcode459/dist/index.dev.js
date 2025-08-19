"use strict";

/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function repeatedSubstringPattern(s) {
  // 1. 当字符串为空或长度为1时直接返回false
  if (s.length === 0 || s.length === 1) {
    return false;
  } // 2. 获得KMP算法的next数组 (正确构建)


  var getNext = function getNext(s) {
    // 2.1 正确初始化next数组
    var next = new Array(s.length).fill(0);
    var j = 0; // j指向最长公共前后缀的末尾
    // 2.2 构建next数组

    for (var i = 1; i < s.length; i++) {
      // 当字符不匹配时，回退j
      while (j > 0 && s[i] !== s[j]) {
        j = next[j - 1];
      } // 当字符匹配时，扩展公共前后缀


      if (s[i] === s[j]) {
        j++;
      } // 关键修复：应该是next[i] = j，而不是next[j] = i


      next[i] = j;
    }

    return next;
  };

  var next = getNext(s); // 3. 判断是否由重复子串组成

  var len = s.length;
  var maxLPS = next[len - 1]; // 最后一个字符的最长公共前后缀长度
  // 关键条件：最长公共前后缀不为0，且字符串长度能被(len - maxLPS)整除

  if (maxLPS !== 0 && len % (len - maxLPS) === 0) {
    return true;
  }

  return false;
}; // 测试用例验证


console.log(repeatedSubstringPattern("abab")); // true  (ab重复)

console.log(repeatedSubstringPattern("abcabc")); // true  (abc重复)

console.log(repeatedSubstringPattern("aba")); // false

console.log(repeatedSubstringPattern("a")); // false

console.log(repeatedSubstringPattern("aaaa")); // true  (a重复)