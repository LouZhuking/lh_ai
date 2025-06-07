# map
 array es6 新增方法
 返回一个全新数组，不改变原数组
 map 方法接受一个函数作为参数，该函数会被自动传入三个参数，分别为当前元素、当前位置和数组本身。
 我们可以看到，map 方法返回的数组，元素为原数组调用函数处理后的值。
 // parseInt num 
['1','2','3'].map((num, index, arr)=>{
  console.log(num, index, arr);
  return num;
})
// 第二个参数是进制
console.log(parseInt('1', 0,['1','2','3'])) // 10进制
console.log(parseInt('2', 1,['1','2','3'])) // 基数1是无效进制
console.log(parseInt('3', 2,['1','2','3'])) // 2进制大 '3'不是有效数
