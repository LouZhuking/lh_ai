import {
  useEffect,
  memo  
} from 'react'



const Button = ({num}) =>{
  useEffect(()=>{
    console.log('button useEffect');
  },[])
  console.log('Button render');

  return (
    
    <button>{num}Click me</button>
  )     
}

// 高阶组件
export default memo(Button)