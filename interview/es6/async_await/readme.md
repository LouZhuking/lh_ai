# async await 是什么， 如何实现的？

它是 ES2017 引入的异步编程语法糖，让异步代码写起来像同步，解决了
then 链式调用很麻烦的问题

- async/await 组合使用
- async 申明的函数一定返回一个 Promise
- await 会暂停 async 函数的执行，等待右侧的 Promise 解决后继续
- 本质还是异步的，后面的代码会封装到 promise 的 then 里面

- 本质上, async/await 是对 Promise + Generator 的封装
  generator 思想很好, \* 区别于普通函数, yield 暂停
  运行得到一个生成器迭代对象 next() value 和 done 状态
  太复杂了，
  async 函数内部会被编译成一个状态机(等待? 完成?)
- async/await 简单优雅，但不要滥用, 并发的请用 Promise.all
