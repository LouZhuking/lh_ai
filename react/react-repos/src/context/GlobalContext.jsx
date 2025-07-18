import {
  createContext
} from 'react'


export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  return (
    <GlobalContext.Provider value="">
      {/* // 为什么会把传过来的children渲染在这里 */}
      {children}
    </GlobalContext.Provider>
  )
}