# reducer and context
- useReducer 的核心
    - 响应式状态管理
    - reducer 纯函数 相同的输入相同的输出 状态生产 状态改变定规矩
    - initValue 初始值
    - dispatch 派发 命令和动作 {type: '', payload: ''}
- useContext
    - CreateContext
    - Context.Provider
    - useContext
- useContext(通信) + useReducer (响应式状态管理)
    跨层级全局 -> 应用 (theme/login/todos/..) 状态管理 (redux的前身)

- 自定义hook
    组件 (渲染) + hook(状态)

- hook + useContext 全局应用级别响应式状态

- hook + useContext + useReducer 全局应用级别响应式状态管理