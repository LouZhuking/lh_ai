const arr = [1,2,3];
// 可迭代对象 比计数循环可读性更好
for (let item of arr){
  console.log(item);
}
// for of item 还要拿到index?
for (const item of arr.entries()){
  // 每一项都是数组， 第一项是key， 第二项是value
  // arr.entries() 是什么？
  console.log(item);
}
// for of  item 还要拿到index?
for (const [index, value] of arr.entries()){
  console.log(index,value);
}