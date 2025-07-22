import { 
  useRef,
  useEffect,
  forwardRef
} from 'react'

import './App.css'

function Light (props, ref) {
  console.log(props, ref);
  
  return (
    <div>
      <input type="text" ref={ref} />
    </div>
  )
}
// 返回一个全新的组件， ref 会被传递给新组件
const WrapperLight = forwardRef(Light)

function App() {
  // 父组件 ref 
  const ref = useRef(null)
  console.log(ref.current);

  useEffect(() =>{
    ref.current?.focus()
  },[])
  

  return (
    <div className='App'>
      {/* <input ref={ref} /> */}
      {/* <Light ref={ref} /> */}
      <WrapperLight ref={ref} />
    </div>
  )
}

export default App
