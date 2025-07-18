## 路由模式

### hash路由
  - 基于URL中的#来改变当前页面的状态，window.location.hash
  - vue下的hash模式，window.onhashchange 哈希解析

### history路由
  - 利用h5 history api来操作浏览器的历史记录栈
  - 通过利用history.pushState() 或者 history.replaceState() 来改变url,但是改变后需要手动刷新页面，才能监听路由的改变
  - 使用window.onpopState 来监听路由的改变
  - (传统的多页面应用，更美观更完整)

### SPA的优缺点，以及在何种场景下更适合使用SPA

  - 优点：
      用户体验好、性能好、前后端分离
      组件化和模块化
      更好的客户逻辑处理
  - 缺点：
      初始化加载时间较长
      SEO问题比较严重
      复杂性比较高
      不利于离线浏览
  - 场景：
      项目侧重于用户体验
      对于一些需要保持高度一致性的UI设计和交互
      当项目有足够的资源投入，并且可以承担初始化加载时间较长
      