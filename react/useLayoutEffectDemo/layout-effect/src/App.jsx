import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import './App.css'
import { use } from 'react'

// 第一种用法
// function App() {
//   // 响应式对象
//   const boxRef = useRef();
//   console.log(boxRef.current, boxRef);

//   useEffect(() => {
//     console.log('useEffect height', boxRef.current.offsetHeight);
//   }, [])

//   useLayoutEffect(() => {
//     console.log('useLayoutEffect height', boxRef.current.offsetHeight);
//   }, [])

//   return (
//     <>
//       <div ref={boxRef} style={{ height: 100 }}></div>
//     </>
//   )
// }


// 第二种用法
// function App() {
//   const [content, setContent] = useState('한때 진심으로 사랑할 기회가 내 앞에 있었지만, 나는 그것을 소중히 여기지 못했고, 잃고 나서야 후회했다. 이 세상에서 가장 고통스러운 일은 바로 이것이다. 네 검이 나를 죽이기 위한 것이라면, 그렇다면 내 가슴에 찔러라. 만약 하늘이 다시 한 번 기회를 준다면, 나는 그 여자에게 세 글자를 말할 것이다. 그것은 이다. 그리고 만약 이 사랑에 기간을 정해야 한다면, 나는 일만 년을 원한다')
//   const ref = useRef();
//   // useEffect(() => {
//   //   setContent('曾经有一份真挚的爱情摆在我面前，我没有珍惜，等到失去的时候才追悔莫及，人世间最痛苦的事莫过于此。你的剑是用来杀我的吗？那插在我胸口上吧。如果上天能够给我一个再来一次的机会，我会对那个女孩子说三个字——‘我爱你’。如果非要在这份爱上加上一个期限，我希望是一万年。')
//   //   ref.current.style.height = '200px';
//   // }, [])
//   // useLayoutEffect(() => {
//   //   // 阻塞渲染 同步的感觉
//   //   setContent('曾经有一份真挚的爱情摆在我面前，我没有珍惜，等到失去的时候才追悔莫及，人世间最痛苦的事莫过于此。你的剑是用来杀我的吗？那插在我胸口上吧。如果上天能够给我一个再来一次的机会，我会对那个女孩子说三个字——‘我爱你’。如果非要在这份爱上加上一个期限，我希望是一万年。')
//   //   ref.current.style.height = '200px';
//   // }, [])


//   return (
//     <div ref={ref} style={{ height: '100px', background: 'lightblue' }}>{content}</div>
//   )
// }

// 第三种用法
// 弹窗
function Modal() {
  const ref = useRef();
  useLayoutEffect(() => {
    const height = ref.current.offsetHeight
    const width = ref.current.offsetWidth
    ref.current.style.marginTop = `${(window.innerHeight - height) / 2}px`
    ref.current.style.marginLeft = `${(window.innerWidth - width) / 2}px`
  }, [])

  return <div ref={ref} style={{ background: 'lightblue', position: 'absolute', height: '200px', width: '200px' }}>我是弹窗</div>
}

function App() {
  return (
    <>
      <Modal />
    </>
  )
}


export default App