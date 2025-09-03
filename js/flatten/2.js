// reduce 方法把数组合并成一个值。
// 多维数组转为一维数组

const flatten = arr => 
  arr.reduce((acc,cur) =>
    acc.concat(Array.isArray(cur)?flatten(cur):cur),[])