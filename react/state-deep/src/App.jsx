import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('')
  
  const handleClick = () =>{
    // 异步 不是同步 
    // react 性能优化， 合并多次更新 统一处理
    // 重绘重排
    // 数据绑定，界面更新
    // JS 引擎 V8 ，高速过路费  渲染引擎 Blink
    // 重绘重排

    // setCount(count+1)
    // setCount(count+1)
    // setCount(count+1)
    // // 触发了三次，执行是同步的，
    // setTitle('hello')
    // setColor('red')
    // setState 函数式更新语法
    // 保证每个更新都基于上一个最新的更新
    // 界面的更新合并为一次的, 不会阻塞 JS 引擎的执行
    // 多次操作一个状态，想要拿到最新的值 通过函数式更新语法传递给prev
    setCount(prev => prev + 1) // prev 上一个状态 使其+1
    setCount(prev => prev + 1) // 找到上一个状态的值 使其+1
    setCount(prev => prev + 1)
    // 看似执行了三次实际上只执行了一次页面上只渲染了一次
  }
  return (
    <>
      <p>当前记数:{count}</p>
      <button onClick={handleClick}>+3</button>
    </>
  )
}

export default App
