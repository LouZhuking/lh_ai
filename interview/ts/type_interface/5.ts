interface AddFn {
  (a: number, b: number) : number
}

// 函数的参数类型 和 返回值类型
type AddType = (a:number, b: number) => number
// 类型的别名
type NumberOther = number;