"use strict";

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function groupAnagrams(strs) {
  // 如果字符串为空则返回空
  if (strs[0] === null) return strs[0]; // 1.创立哈希表存储遍历的数值和索引

  var preStr = {}; // 2. 遍历该数组下标索引的字符串

  for (var i = 0; i < strs.length; i++) {
    // 3.对字符串进行排序
    var sortStr = strs[i].split('').sort().join(''); // console.log(sortStr);
    // 4.判断哈希表中是否有该键值对

    if (preStr[sortStr]) {
      preStr[sortStr].push(strs[i]);
      console.log(preStr[sortStr]);
    } else {
      preStr[sortStr] = [strs[i]];
    }
  }
};

var strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
groupAnagrams(strs);