import {
  useEffect,
} from 'react'
const Button = () => {
  useEffect(() => {
    console.log('button useEffect');
  }, [])
  console.log('Button render')
  return <button>Click me</button>

}

export default Button
