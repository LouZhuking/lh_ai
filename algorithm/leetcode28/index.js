/**
 * @param {string} haystack  // 主字符串，要在其中搜索
 * @param {string} needle    // 模式字符串，要搜索的子串
 * @return {number}        // 返回needle在haystack中首次出现的位置索引，未找到返回-1
 */
var strStr = function(haystack, needle) {
    // 1.当needle长度为0的时候直接返回0
    if(needle.length === 0){
      return 0;  // 根据LeetCode约定，空字符串返回0
    }
    
    // 2.获得next数组表 (KMP算法的核心预处理步骤)
    const getNext = (needle) =>{
      // 2.1初始化数据
      let next = new Array(needle.length).fill(0)  // 创建next数组，长度与needle相同，初始值全为0
      let j = 0;  // j指针：指向前缀末尾位置，也表示当前最长公共前后缀长度
      // next.push(j)  // 原注释掉的代码：之前用数组push方式，现改为固定长度数组

      // 构建next数组的核心循环
      for(let i = 1; i < needle.length;i++){  // i从1开始，因为next[0]固定为0
        // 2.2 前后缀不相同的情况 - 需要回退j指针
        while(j > 0 && needle[i] !== needle[j]){
          j = next[j - 1];  // 关键：利用已计算的next值回退j，避免重复比较
        }
        
        // 2.3 前后缀相同的情况下 - 可以扩展当前前后缀
        if(needle[i] === needle[j]){
          j++;  // 当前字符匹配，前后缀长度+1
          // next.push(j);  // 原注释掉的push方式
        }
        next[i] = j;  // 记录needle[0..i]子串的最长公共前后缀长度
      }
      return next;  // 返回构建好的next数组
    }

    // 3 找到needle数组的索引下标遍历数组haystack (实际的字符串匹配过程)
    // 3.1 
    let next = getNext(needle);  // 先计算needle的next数组
    let j = 0 ;  // j指针：指向needle中当前比较的位置
    
    // 遍历主字符串haystack
    for(let i =0; i < haystack.length;i++){
      // 3.2 前后缀不同的情况 - 利用next数组进行智能回退
      while(j>0 && haystack[i] !== needle[j]){
        j = next[j-1];  // 关键：不匹配时根据next数组回退j，避免暴力回退
      }
      
      // 字符匹配的情况
      if(haystack[i] === needle[j]){
        j++;  // 当前字符匹配，needle前进一位
      }
      
      // next[i] = j;  // 原注释掉的错误代码：这里不需要记录next数组
      
      // 检查是否找到完整匹配
      if(j === needle.length){
        return (i - needle.length+1)  // 返回匹配起始位置：当前i减去needle长度再加1
      }
    }
    
    return -1;  // 遍历完整个haystack仍未找到匹配，返回-1
};