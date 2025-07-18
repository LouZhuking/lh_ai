import {
  useReducer,
} from 'react'
import todoReducer from '@/reducers/todoReducer'

// 参数的默认值
// 解构 []=[] {} = {}
export function useTodos(initial = []) {
  const [todos, dispatch] = useReducer(todoReducer, initial)

  const addTodo = (text) => dispatch({
    type: 'ADD_TODO', text
  })
  const toggleTodo = (id) => dispatch({
    type: 'TOGGLE_TODO', id 
  })
  const removeTodo = (id) => dispatch({
    type: 'REMOVE_TODO', id
  })

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo
  }
}