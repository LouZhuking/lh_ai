import { useState } from 'react'
import './App.css'

function App() {
  const [value, setValue] = useState("")
  const [todoList, setTodoList] = useState([])

  // 添加内容
  const addTodos = () => {
    if (!value.trim()) return

    const newTodo = {
      id: Date.now(),
      text: value,
      complete: false
    }
    setTodoList([...todoList, newTodo])
    setValue("")
  }
  // 删除内容
  const deleteTodo = (id) => {
    setTodoList(todoList.filter(todo => todo.id !== id))
  }

  const toggleCompleted = (id) => {
    setTodoList(todoList.map(todo =>
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    ))
  }


  return (
    <div>
      <h1>TodoList</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={addTodos}>添加</button>
      <ul>
        {
          todoList.map((todo) => (
            <li key={todo.id}>
              <span style={{
                textDecoration: todo.complete ? 'line-through' : 'none',
                color: todo.complete ? '#888' : '#000'
              }}>
                {todo.text}
              </span>
              <button onClick={() => toggleCompleted(todo.id)}>
                {todo.complete ? '撤销' : '完成'}
              </button>
              <button onClick={() => deleteTodo(todo.id)}>删除</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App
