# 手写 call

- 手动指定函数内部的 this
- 参数 一个个 apply []
- 第一个参数是 null 或 undefined this ?
  严格模式报错
- 应用场景区别
  - call apply 立即执行的，区别是参数的传递方式，可以互换使用
  - bind 延迟执行

## 手写 call

- call 是属于所有函数的，Function 原型链上的方法
  greeting.call

## 包含的技能点

- 原型 Function
- 函数参数的理解
  context, rest 运算符
- context 为空，null， undefine -> window
- 在 context 上挂载方法， 轻松实现函数内部的 this 指向 context
  js 动态性 污染了 context
  es6 symbol 唯一值, 不会有覆盖 context 的属性
  delete context 上的方法
- return 返回值
