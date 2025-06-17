// 定义一个记忆化斐波那契函数
function memorizeFib(){
  // 使用闭包特性，外层函数返回内层函数
  // cache对象作为自由变量，用于存储计算结果
  const cache = {} // 缓存对象，存储已计算的斐波那契数列值
  
  // 返回实际的斐波那契计算函数
  return function fib(n){
    // 基本情况：n为0或1时直接返回n
    if(n<=1) return n; // 递归终止条件
    
    // 检查缓存中是否已有计算结果
    if(cache[n]) return cache[n]; // 如果已计算过，直接返回缓存结果
    
    // 递归计算并缓存结果
    cache[n] = fib(n-1) + fib(n-2); // 计算并存储斐波那契数列第n项
    
    // 返回计算结果
    return cache[n];
  }
}

// 获取记忆化后的斐波那契函数
const fib = memorizeFib()
// 测试计算第10项斐波那契数
console.log(fib(10)) // 输出：55

// 闭包 1. 函数嵌套函数，函数包着函数
// 内部的函数可以在外部访问
// 自由变量 （不会销毁）
// 作用域链是跟词法作用域相关的