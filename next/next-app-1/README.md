## App Router

- 特殊文件名
  布局（layout.js）、模板（template.js）、加载状态（loading.js）、错误处理（error.js）、404（not-found.js）等。
- app/dashboard
  layout.js 会包含子组件的布局
- app 中的也就是说 `layout` 会包裹 `template`，`template` 又会包裹 `page`。
- layout 会保持 useState 不变 而 template 会保持 useState 改变
