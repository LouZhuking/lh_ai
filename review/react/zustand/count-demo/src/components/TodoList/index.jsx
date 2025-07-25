import {
  useTodosStore
} from '../../store/todos'

const TodoList = () => {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo
  } = useTodosStore()


  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={() => toggleTodo(todo.id)}>toggle</button>
            <button onClick={() => deleteTodo(todo.id)}>delete</button>
            <span>{todo.completed ? '✅' : '❌'}</span>
            {/* 添加新的待办事项 */}
            <br />
          </li>
        ))}
        <input
          type="text"
          placeholder="Add a new todo"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTodo(e.target.value)
              e.target.value = ''
            }
          }}
        />
      </ul>
    </div>
  )
}


export default TodoList