## reducer and context
-  useReducer 的核心
    - 响应式状态管理
    - reducer 纯函数 状态生产 状态改变规矩
    - initValue
    - dispatch 派发一个action
        {type: '', payload: }
- useContext
    createContext
    Context.Provider
    useContext
- useContext(通信) + useReducer (响应式状态管理)
    跨层级全局-> 应用 (theme/login/todos/..) 状态管理 (redux的前身)

- 自定义hook
    生成组件渲染 + hook(状态)
    
- hook + useContext
    全局应用级别响应式状态
- hook + useContext + useReducer
    全局应用级别响应式状态管理



# 总结

- 在写项目当中为了方便代码的简洁和复用性，需要在全局创建TodoContext上下文对象，并且封装好Hooks函数使其可以在全局当中进行引用，方便代码的复用性和简洁
- 将我们的根组件当中引用TodoContext组件并向全层级组件提供数据
- 当我们在写useTodos方法时，需要使用到useReducer函数来对自定义Hooks进行应用管理和状态管理
- 然后在useTodos当中通过useReducer来调用创建的方法
const [todos, dispatch] = useReducer(todoReducer, initValue)
- 完成上述功能完善之后，需要将封装好的useTodos在根组件当中引用，并且在根组件当中向全层级组件提供数据
- 当我们在其他子组件当中需要获取数据的时候，使用useContext来获取数据并且解构出我们所需要的值，写好逻辑函数完成功能
- 最后就是表单的渲染，需要将我们写好的方法拿到TodoList表单当中使用，这样整体页面的渲染就算是完成了，就可以看到页面的简单实现效果了