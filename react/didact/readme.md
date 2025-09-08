# 手写 React

- DidReact

  - 命名空间 namespace
  - 对象字面量

- VDOM
  UI 表达 JSX
  JSX -> 转成 VDOM ?

- JSX react 优点
  js 里编写 HTML, 及其简便的表达 UI
  babel React.createElement
  Dideact.createElement

  -> render 生成真正的 DOM

## Didact 运行的入口

- babel 将 JSX 转译为 React.createElement 方法调用,
  给相应的参数，生成 VDOM
  @babel/preset-react pragma 编译后的函数名字
  pragma JSX 不是 react 的专属, vue 中也可以用 jsx

## createElemet

- App.jsx -> babel -> Dideact.createElement(tag,props,...children)
  返回的结果 VDOM (虚拟 DOM 在后端运行)
  由 Vnode 结点组成的 VDOM 树，每个节点包含 type, props
  两个属性, props.children 是子结点，也是一个对象

React.createElement 返回的 Element 就是一个描述“要在页面上渲染什么”的普通 JavaScript 对象（即虚拟 DOM 节点），它包含 type、props 等属性，是 React 用来对比变化并高效更新真实 DOM 的虚拟表示。

- createTextElement 这么复杂?
  type 没有的
  children 没有的
  统一， 执行 render

## 目前完成

- React is a namespace
- The createElement Function (工厂模式)
- The render Function
- Concurrent Mode 并发模式
- fibers 机制

## Concurrent Mode 并发模式

React Concurrent Mode 是一种让渲染过程可中断、可优先级排序的机制，通过将工作拆分为小块并允许高优先级更新（如用户输入）插队，从而避免主线程阻塞，提升应用的响应性和流畅度。
fiber 结点 工作结点

- 中断
- 继续
- fiber 结点对象有哪些属性
