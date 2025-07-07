import { useState,useEffect } from 'react'
import './App.css'

function App() {
  console.log('组件开始执行');
  
  // 正作用？渲染组件
  // 渲染完组件之后搞点副作用
  // 生命周期函数
  useEffect(()=>{
    console.log('组件渲染完成');
  })
  // 组件的模版编译
  // 挂载到#root节点上
  console.log('组件的模版编译');
  
  return (
    <>

    </>
  )
}

export default App
