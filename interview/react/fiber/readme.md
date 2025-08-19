# React Fiber 机制

- 组件比较多，组件树(树状组件)的深度比较深
  每个组件都需要经历 JSX 模版的编译、 VDOM 的创建、响应式的生命、
  生命周期、挂载等,

  怎么办？ 核心问题是什么？
  react 组件渲染是同步代码 , 更加重要的没机会做
  打断一下，让浏览器响应用户更优先的做一下，到时候再回来接着执行。

- fiber 机制是 react 16 引入的重写核心算法,实现了可中断渲染。

  - 学习过什么 api 类似 fiber
    可打断可连续
    requestAnimationFrame
    requestIdleCallback

- requestAnimationFrame
  是浏览器提供的用于在下一次重绘之前执行动画代码的 API,它能确保动画流畅运行并节省资源
  1s 执行 60 次

- requestIdleCallback

  - React 组件渲染低优先级任务
    不能往死里干，需要被中断
  - 更高优先级的任务是用户交互的交互

  - react 组件树 渲染任务拆分
    在一个时间切片里能执行
    这个时间长度用 requestIdleCallback 来描述的
    一直去问还有多少可执行时间
