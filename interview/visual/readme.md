# 数据可视化

- echarts
  老板、客户，数据报表
  开源的用于绘制柱状图、饼状图等的可视化库
  pnpm i echarts
  pnpm i @types/echarts -D
- @types/echarts
  echarts 类型申明文件， 单独的
  为什么 react 不需要单独安装类型申明文件?
  react 是用 ts 写出来的
  echarts 原生 js 和类型声明文件是分开的

- 直观看出数据的价值
  echarts 2D
  three.js 3D
  数据可视化

- echarts 流程
  - 安装 echarts,@types/echarts
  - init 实例化
    要传给他一个图标的 DOM 挂载点
    useRef<HTMLDivElement>(null)
    null | HTMLDivElement
    联合类型 useRef 可变对象
  - setOption(option)
    series 数据条目
