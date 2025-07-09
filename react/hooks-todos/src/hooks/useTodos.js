import{
  useState,
  useEffect
}from 'react'

export const useTodos = ()=>{
    const [todos, setTodos] = useState(JSON.parse(
      localStorage.getItem('todos')
    ))

    const addTodo = (text) =>{
        // setTodo
        // 数据状态是对象的时候
        setTodos([
          ...todos,
          {
            id: Date.now(),
            text,
            isCompleted:false
          }
        ])
    }

    const onToggle = (id) =>{
        // todos 数组找到id 为id， isComplete !isComplete
        // 响应式？ 返回一个全新的todos
        setTodos(todos.map(
          todo => todo.id === id ? {...todo, 
            isCompleted: !todo.isCompleted} : todo
        ))
    }

    const onDelete =(id)=>{
      setTodos(todos.filter(todo => todo.id !== id))
    }
      useEffect(()=>{
        // console.log('```````');
      window.localStorage.setItem('todos',JSON.stringify(todos))
    },[todos])
    return{
      todos,
      setTodos,
      addTodo,
      onToggle,
      onDelete
    }
}



