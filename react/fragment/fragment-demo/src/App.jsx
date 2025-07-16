import {
  useState,
  Fragment   // 文档碎片组件
} from 'react'
import './App.css'


// function Demo() {
//   return (
//     <Fragment>
//       <h1>Hello World</h1>
//       <p>你好</p>
//     </Fragment>
//   )
// }

function Demo({ items }) {
  return items.map((item) => (
    <Fragment key={item.id}>
      <h1>{item.title}</h1>
      <p>{item.content}</p>
    </Fragment>
  ))
}



function App() {

  const items = [
    {
      id: 1,
      title: '标题1',
      content: '内容1'
    },
    {
      id: 2,
      title: '标题2',
      content: '内容2'
    },

  ]
  return (
    <>
      <Demo items={items} />
    </>
  )
}

export default App
