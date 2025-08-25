# 性能优化

## 重绘重排

- 重绘
  当元素样式改变但不影响布局时，浏览器重新绘制元素的过程。如改变颜色、背景等。
- 重排
  DOM 元素的尺寸、位置发生变化时，浏览器需要重新计算布局，影响其他元素位置的过程。
  重排一定会触发重绘(性能开销更大)，重绘不一定会触发重排。

### DEMO 1 批量修改 DOM

```js
// 不对 多次操作可能触发多次重排重绘
// 虽然现代浏览器会合并更新
const el = document.getElementById("myEl");
el.style.width = "100px";
el.style.height = "100px";
el.style.margin = "10px";
// good
el.style.cssText = "width:100px;height:100px;margin:10px";
el.className = "my-class"; // 用类名而不是一堆的js代码
```

### 使用文档碎片

```js
const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const el = document.createElement("div");
  fragment.appendChild(el); // 没有重绘重排
}
document.body.appendChild(fragment);
// 批量添加元素时，使用document.createDocumentFragment()优化
```

## 脱离文档流进行操作 下线

```js
const el = document.getElementById('myEl')
el.style.position = 'absolute';
el.style.display = 'none';
...进行大量DOM 操作

el.style.display = 'block';
el.style.position = 'static';
```

### 缓存布局信息

```js
// offsetTop 读取， 但是每次都会触发重排以获得盒子的布局信息
for (let i = 0; i < 100; i++) {
  el.style.top = el.offsetTop + 1 + "px";
}

let top = el.offsetTop; // 缓存布局信息
for (let i = 0; i < 100; i++) {
  top++;
  el.style.top = top + "px";
}
```

### 使用 transform 代替位置调整

```js
el.style.left = "100px";
// 只触发重绘，性能更好
el.style.transform = "translateX(100px)";
```

## 资源加载优化

- 图片懒加载
- 路由懒加载
  代码文件上， code splitting 代码分割
- 资源预加载
未来可能会用到的资源
<link rel="prefetch" href="xxx.js">
  dns-prefetch dns 预解析
  preload 当前页面必须资源，立即加载
  - script 资源的加载 阻塞的
    async 下载完成后立即执行：一旦脚本下载完成，暂停 HTML 解析，立即执行脚本，执行完后再继续解析
    defer 脚本等到整个 HTML 文档解析完成后（DOMContentLoaded 事件之前），按出现顺序执行。
  -webp 格式图片
    图片的优化，显著的减少体积，并且质量不受影响
  -图标字体库
  减少http 请求

## JS 执行优化

- 防抖节流
- web workers 处理复杂计算
- requestAnimationFrame 动画优化
- requestIdleCallback react fiber 机制
  schedule 机制

## 框架层优化

- memo,useMemo,useCallback 避免不必要的渲染
- shadcn-ui 按需加载组件库
- 合理使用 key 优化列表渲染

## 缓存策略
  - 强缓存和协商缓存
      Expires(客户端时间不准确) / Cache-Control
      LastModified if-modified-since 时间戳  304
      ETag if-none-match
  - localStorage/sessionStorage/cookie
## 网络优化
  - CDN 加速
      静态资源, 分流 ，会缓存文件
      多路复用 多域名服务器 img1.baidu.com img.baidu.com
  - Gzip 压缩
  - HTTP/2 多路复用
  - DNS 预解析

## 首屏优化
  - SSR
      组件渲染在服务器端已经完成编译、执行，浏览器端显示执行
  - 骨架屏
  - http 2.0 server push 首屏数据推送
  