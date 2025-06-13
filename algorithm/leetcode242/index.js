/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  // 1.当两个字符串的长度不一样的就直接返回false
  if(s.length !== t.length){
    return false;
  }
  // 2. 定义一个哈希表
  // 创建了一个长度为26的数组，并用0填充每个元素
  const table = new Array(26).fill(0);
  // 3. 遍历字符串s 
  // 3.1 for 循环遍历字符串 s 的每个字符
  // 3.2 s.codePointAt(i)获取当前字符的Unicode码点
  // 3.3 -'a'.codePointAt(0) 计算相对于字母'a'的偏移量
  // a->0 b->1 c->2
  // 3.4 table[...]++ 在对应的字母计数器上加1
  for(let i = 0;i < s.length; i++){
    table[s.codePointAt(i)-'a'.codePointAt(0)]++;
  }
  // 4. 遍历字符串t
  for(let i = 0;i < t.length;i++){
    table[s.codePointAt(i)-'a'.codePointAt(0)]--;
    // 4.1 table[s.codePointAt(i)-'a'.codePointAt(0)--]-- 从哈希表中减去1
    // 4.2 如果哈希表对应的值小于0 说明t字符串有一个字符不在s字符串中
    if(table[s.codePointAt(i)-'a'.codePointAt(0)] < 0){
      return false;
    }
  }
  return true
};