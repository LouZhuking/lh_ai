// {} key:value 0(1) HashMap Map
// 第一种重要的数据结构
// 第二种重要数据结构 链表、队列、栈
// 长度限定 、类型
// 可以、动态扩容
const arr = [1,2,3,4,5];
const arr2 = new Array(5).fill(undefined);
console.log(arr2);
arr2[8] = undefined;
console.log(arr2);
for (let key in arr2){
  console.log(key,arr2[key]);
}
for (let key of arr2){
  console.log(arr2[key]);
}