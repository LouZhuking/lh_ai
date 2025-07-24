# 性能优化 hook

- 父子组件渲染顺序
    - 执行的时候先外到内  组件树
    - 完成渲染 完成组件的挂载 先内到外
- Button 组件该不该重新渲染？
    - 父组件局部， count 改变和Button组件没有关系
        Button  JSX  不重新渲染 重排重绘
    
    - 性能优化  
        响应式和性能 非常好 
        切分组件 (一个组件改变了另一个组件不受影响) 热更新ss
        组件之间独立
        子组件 React.memo
        createContext  useContext 所有的状态全部给一个
        Context 好吗？
        不好， 性能 所有状态都是用过一个reducer 生成