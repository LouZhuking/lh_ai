# react repos 项目开发
- api.github.io/users/LouZhuking/repos








## 路由设计
    - react-router-demo
    - /repos/:username
    - /repos/:id
    懒加载
    hash/history
    (路由守卫)
    useParams : username
## 数据管理
    App 数据管理
    repos
    useContext + useReducer + hooks
    createContext + reducer + useRepos
## react
    组件的粒度
## api 
    fetch 
    - axios http请求库
    - 独立的模块，所有请求会从组件中分离到api目录下
  是一个基于promise 网络请求库，作用于node.js和浏览器中。它是 isomorphic的（即同一套代码可以运行在浏览器和node.js中）。在服务端它使用原生 node.js http模块，而在客户端（浏览端）则使用 XMLHttpRequests

## 项目目录结构，项目架构
    - api 
        应用中的所有接口
    - main.jsx
        入口文件
        添加路由， SPA
        添加全局应用状态管理