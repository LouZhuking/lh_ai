import {
  useState,
  useReducer
} from 'react'
import './App.css'

// function App() {

//   return (
//     <>
//       <LoginContext.Provider>
//         <ThemeContext.Provider>
//           <TodosContext.Provider>
//             <Layout>
//               <Header />
//               <Main />
//               <Footer />
//             </Layout>
//           </TodosContext.Provider>
//         </ThemeContext.Provider>
//       </LoginContext.Provider>
//     </>
//   )
// }

// 管理好多
const initialState = {
  count: 0,
  isLogin: false,
  theme: 'light'
}
// 管理 分部门
// reducer纯函数 返回可靠的状态
// 状态生产器
// case 状态修改的规定 
const reducer = (state, action) => {
  // increment, decrement, 
  // {type: 'increment'}
  switch (action.type) {
    case 'increment':
      // 新的状态
      return {
        count: state.count + 1
      }
    case 'decrement':
      return {
        count: state.count - 1
      }
    case 'multiply':
      return {
        count: state.count * 2
      }
    case 'divide':
      return {
        count: state.count / 2
      }
    case 'incrementByNum':
      return {
        count: state.count + parseInt(action.payload)
      }
    // 没有按照规矩来修改的话，不能对此产生修改
    default:
      return state
  }
}


function App() {
  // 初始值 initialValue
  // 当前的状态值 旧状态 新状态
  // 界面由当前状态来驱动
  const [count, setCount] = useState(0)

  // 大型项目
  // dispatch 派发 函数
  // 参数固定 {type: ''} action_type

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      <h1>count:{state.count}</h1>
      <button disabled={state.count >= 10} onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button disabled={state.count <= 0} onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'multiply' })}>*2</button>
      <button onClick={() => dispatch({ type: 'divide' })}>/2</button>
      <input type="text" value={count} onChange={(e) => setCount(e.target.value)} />
      <button
        onClick={() => dispatch({ type: 'incrementByNum', payload: count })}>
        incrementByNum
      </button>
    </>

  )
}

export default App
