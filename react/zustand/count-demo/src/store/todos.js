// todoList store
// 全局状态模块化
import {
  create
} from 'zustand'

export const useTodosStore = create((set) =>({     
    todos: [
      {
        id: 1,
        text: '打豆豆',
        completed: false
      }
    ],
    addTodo: (todo) => set((state) => ({
      todos: [
        ...state.todos,
        {
          id: state.todos.length + 1,
          text: todo,
          completed: false
        }
      ]
    })),
    toggleTodo: (id) => set((state) => ({
      todos: state.todos.map((todo) => ({
        ...todo,
        completed: todo.id === id ? !todo.completed : todo.completed
      }))
    })),
    deleteTodo: (id) => set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id)
    }))


}))