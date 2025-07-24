import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/Button'

function App() {
  const [count, setCount] = useState(0)
  console.log('App render');

  useEffect(() => {
    console.log('count', count);
  }, [count])

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Button count={count}>Click me</Button>
    </>
  )
}

export default App
