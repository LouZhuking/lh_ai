import { useState } from 'react'
import './App.css'

function App() {
  const [value, setValue] = useState("")
  const [todoList, setTodoList] = useState([])

  // 添加待办
  const addTodos = () => {
    if (value.trim() === '') return

    const newTodo = {
      id: Date.now(),
      text: value,
      completed: false  // 添加完成状态
    }

    setTodoList([...todoList, newTodo])
    setValue("")
  }

  // 删除待办
  const deleteTodo = (id) => {
    setTodoList(todoList.filter(todo => todo.id !== id))
  }

  // 切换完成状态
  const toggleComplete = (id) => {
    setTodoList(todoList.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 回车键添加
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodos()
    }
  }

  return (
    <div>
      <h1>TodoList</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="输入待办事项..."
      />
      <button onClick={addTodos}>添加</button>

      <ul>
        {todoList.map(todo => (
          <li key={todo.id}>
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#000'
            }}>
              {todo.text}
            </span>
            <button onClick={() => toggleComplete(todo.id)}>
              {todo.completed ? '撤销' : '完成'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App