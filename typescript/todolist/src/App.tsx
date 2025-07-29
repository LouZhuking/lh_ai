import './App.css'
import HelloComponent from './components/HelloComponent'
// react + typescript
// javascript 可能会有些问题,  主要因为弱类型
// jsx 后缀改成tsx
// 函数进行类型约束
// const HelloComponent = () => {
//   // void 空 ReactNode 
//   return 1
// }

function App() {
  // 编译阶段 
  // 多写了些类型声明文件
  // 多写一些代码 类型申明 代码质量保驾护航
  let count: number = 10;
  const title: string = "Hello typescript";
  const isDone: boolean = true;
  const list: number[] = [1,2,3,4];
  // 元祖类型
  const tuple: [string, number] = ["释永乐", 18];
  // 枚举类型
  enum Status {
    Pending,
    Fullfilled,
    Rejected,
  }
  const pStatus: Status = Status.Pending;
  // 对象的约束？
  // 接口  
  interface User {
    // 这里只能使用分号而不是逗号
    name: string;
    age: number;
    // 这里使用问号 表示可选属性
    isSingle?: boolean;
  }
  // 使用interface 来约定类型
  const user:User = {
    name: "释永乐",
    age: 18,
    isSingle: false
  }

  return (
    <>
    {count}
    {title}
    {user.name} {user.age}
    {/* typescript 很严格 */}
      <HelloComponent name="xww" age= {123} />
    <h1>Todo List</h1>
    <input 
        type="text" 
        name="todo" 
        id="todo" 
        placeholder="请输入待办事项" />  
    </>
  )
}

export default App
