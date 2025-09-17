# 低代码、零代码

- 代码
- Prompt vibe Coding
- coze
  0 代码 AI Agent 开发工具
  完成和写代码一样的功能

## 概念定义

低代码或零代码是通过可视化的拖拽代替手写代码来构建应用，低代码适合开发者提效，
零代码让非技术人员也能搭建简单应用，常用于表单、审批流程、数据看板等场景，
快速满足业务需求

- 可视化 canvas
- 拖拽 好理解 工作流，程序流

## Aisuda

Aisuda（爱速搭）是阿里巴巴推出的一款低代码应用搭建平台，旨在通过可视化拖拽等方式，让开发者和业务人员能快速、高效地构建企业级应用。

## 核心

- 业务或产品需要实现
- 快一点、容易一点、成本低一点
- 低代码编辑器
  - 物料区域(type,props 的组件) 可拖拽的
  - 组合显示区域 (drop) 网页、agent、工作流 (n8n, dify)
  - 属性修改区域

## 阿里的 Antd 组件库

蚂蚁金服

## 物料区组件

可扩展的 组件库

- Container 容器组件

## 我们要开发或维护低代码平台

- ReactFlow 选择一个框架
  pnpm i reactFlow
  pnpm i @supabase/supabase-js

## 第一次总结

使用了 aisuda 阿里低代码编辑器，发现核心是一个 json 的数据结构。
一个通过 children 属性串联的组件对象树。
alloment split pane 布局, 用 tailwindcss 写样式， zustand
来全局状态管理
数据结构就是树，并不复杂，但是是低代码编辑器的核心

- 物料区
- 编辑区
- 设置区

## TypeScript

Record<string, any> 是 TypeScript 中的一个工具类型，它表示一个对象，其所有属性的键都是字符串类型，而属性的值可以是任意类型（any）。

## 拖拽生成

pnpm i react-dnd react-dnd-html5-backend
react-dnd 是一个用于在 React 应用中实现拖放（Drag and Drop）功能的流行库，通过提供可组合的 API 和后端抽象（如 HTML5 或触摸）来简化复杂拖拽交互的开发。

- 根上包着

## 遇到的问题

- useDrop 时候会插入多次
- useDrop 多次重复
  违反了 dry 原则
  封装一下

我们分析了下低代码编辑器 amis，发现核心就是一个 json 的数据结构。

这个 json 就是一个通过 children 属性串联的组件对象树。

从物料区拖拽组件到画布区，就是在 json 的某一层级加了一个组件对象。

选中组件在右侧编辑属性，就是修改 json 里某个组件对象的属性。

大纲就是把这个 json 用树形展示。

然后我们写了下代码，用 allomet 实现了 split pane 布局，用 tailwind 来写样式，引入 zustand 来做全局 store。

在 store 中定义了 components 和对应的 add、update、delete 方法。

然后对应低代码编辑器里的操作，用这些方法实现了一下。

这个数据结构并不复杂，却是低代码编辑器的核心。

这节我们实现了拖拽组件到画布，也就是拖拽编辑 json。

首先我们加了 Button 和 Container 组件，并创建了 componentConfig 的全局 store，用来保存组件配置。

然后实现了 renderComponents，它就是递归渲染 component，用到的组件配置从 componentConfig 取。

之后引入 react-dnd 实现了拖拽编辑，左侧的物料添加 useDrag，画布里的组件添加 useDrop，然后当 drop 的时候，在对应 id 下添加一个对应的类型的组件。

组件类型在 useDrag 的时候通过 item 传递，添加到的组件 id 在 drop 的那个组件里就有。

然后还要处理下 didDrop，保证只 drop 一次。

这样，我们就实现了拖拽编辑 json 的功能。
