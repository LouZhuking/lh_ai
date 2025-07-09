import { useState } from 'react'
import './App.css'
import Todos from './components/Todos'

function App() {

  return (
    <>
      {/* 开发的任务单位就是组件 */}
      <Todos />
    </>
  )
}

export default App
