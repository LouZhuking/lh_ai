// 函数对象
function add(){
  // arguments 函数运行时决定，参数总管
  // 下标访问第几个参数  数组 
  // console.log(arguments,arguments.length,Object.prototype.toString.call(arguments),'/////');
  // arguments 是函数参数的总管，类数组， 有length 属性，for，但是没有数组太多的方法 并不是真正的一个数组
  // 要实现一些函数参数的传递
  // console.log(arguments.map(item => item+1)) // 迭代了数组当中的每一项
  // 如何将类数组转成真正的数组
  const args = Array.from(arguments);
  console.log(Object.prototype.toString.call(args));
  let result = 0;
  for(let i =0; i < args.length;i++){
    console.log(args[i]);
    result += args[i]
  }
  return result
  // return a + b + c
}
// console.log(add.length);
console.log(add(1,2,3));
