/**
 * @param {string} s
 * @return {number}
 */
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
  let index = s.length -1;          // 1. 初始化指针到字符串末尾
  while(s[index] === ' '){          // 2. 跳过末尾所有空格
      index --;
  }
  let wordLength = 0;               // 3. 初始化单词长度计数器
  while(index>=0 && s[index] !== ' '){  // 4. 逆向遍历非空格字符
      wordLength++;                 // 5. 遇到字母就计数+1
      index--;                      // 6. 指针前移
  }
  return wordLength                 // 7. 返回统计的单词长度
};