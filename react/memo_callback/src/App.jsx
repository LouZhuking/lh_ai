import { 
  useState,
  useEffect,
  useCallback,
  useMemo    // 缓存一个复杂计算的值
} from 'react'
import './App.css'
import Button from './components/Button'

function App() {
  const [count, setCount] = useState(0)
  const [num, setNum] = useState(0)
  console.log('App render');

  const expensiveComputation = (n) =>{
    console.log('expensiveComputation');
    // 复杂计算 开销高 
    for(let i = 0; i < 1000000000; i++){
      i++
    }
    return n*2
  }

  const result = useMemo(() => expensiveComputation(count), [count])

  useEffect(() => {
    console.log('count', count)
  }, [count])
  useEffect(() => {
    console.log('num', num)
  }, [num])
  // rerender 重新生成
  // 不要重新生成， 和 useEffect [] 一样
  const handleClick = useCallback(() => {
    console.log('handleClick');
    
  })

  return (
    <>
      {/* <div>{expensiveComputation(count)}</div> */}
      <div>{result}</div>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>increase count</button>
      <br />
      <button onClick={() => setNum(num + 1)}>increase num</button>
      <br />
      <Button num={num} onClick={handleClick}>Click me</Button>
    </>
  )
}

export default App
