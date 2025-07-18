import {
  createContext,
  useReducer
} from 'react'
import {
  repoReducer,
} from '@/reducers/repoReducer'

export const GlobalContext = createContext();

const initialState = {
  repos: [],
  loading: false,
  error: null
}

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(repoReducer, initialState)
  return (
    // state 应用状态
    <GlobalContext.Provider value={{ state, dispatch }}>
      {/* // 为什么会把传过来的children渲染在这里 */}
      {children}
    </GlobalContext.Provider>
  )
}