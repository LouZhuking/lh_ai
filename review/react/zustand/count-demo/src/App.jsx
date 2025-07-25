import { useState } from 'react'
import './App.css'
import { useCounterStore } from './store/count'
import Counter from './components/Counter'
import TodoList from './components/TodoList'
import RepoList from './components/RepoList'

function App() {
  const { count } = useCounterStore()

  return (
    <>
      App中的 {count}
      <br />
      <Counter />
      <TodoList />
      <RepoList />
    </>
  )
}

export default App
