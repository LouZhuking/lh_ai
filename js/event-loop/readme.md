# event loop

事件循环机制 js 执行机制

## js 单线程

同一时刻只做一件事
同步任务尽快执行完，渲染页面(重绘重排)，响应用户的交互(优先)
耗时性任务 ？

- setTimeout/setInterval
- fetch
- eventListener

## script 脚本

一个 script 就是一个宏任务开始 js 调用栈
GPU 计算
同步任务，异步任务(耗时性任务) 均是单线程任务 任务放到某个地方

## 微任务有哪些？

同步任务执行完之后立马执行微任务，紧急的任务，更加优先的

- promise.then()
- MutationObserver
  dom 改变在页面渲染前 拿到 DOM 有啥改变
- queueMicrotask
