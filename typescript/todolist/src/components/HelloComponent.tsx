// 如何约束函数的返回值为ReactNode? JSX
// FC == FunctionComponent
// 如何约定自己需要一个name 的 prop?
interface Props{
  name: string;
  age: number;
}
// typescript 类型约束， 重要的地方一定要约束
// 泛型 泛指内部的类型
const HelloComponent:React.FC<Props> = (props) => {
  // void 空 ReactNode 
  // return 1

  return (
    <div>
      <h1>Hello user:{props.name}</h1>
    </div>
  )
}




export default HelloComponent