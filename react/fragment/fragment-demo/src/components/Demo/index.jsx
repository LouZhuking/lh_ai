import { Fragment } from "react"; // 文档碎片组件

const Demo = ({ items }) => {

  return items.map((item) => (
    <Fragment key={item.id}>
      <h1>{item.title}</h1>
      <p>{item.content}</p>
    </Fragment>
  ))

}

export default Demo;