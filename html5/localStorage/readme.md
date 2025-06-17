# localStorage

- 全局安装 stylus
- npm install -g stylus
- stylus --version
- stylus 何物？

  - 是一个 css 预处理器
  - 更快，更专业
  - .styl 后缀的文件
  - 编译成 css

- stylus 是 css 的超集
  浏览器还是只认 css
  - box-shadow 盒子的立体感觉
- css 有些熟悉直接继承
  每个都要写一遍 无法接受
  默认 16px 颜色黑色
  body color 子元素 body
  有些也不会继承

- background-size: cover; 等比例缩放，裁剪 重点在盒子
  contain 重点在背景 完整显示背景图片

- css 如 js 一样

  - 模块特性
    tab 缩进 自动补全 css 前缀
    模块和作用域的概念

- viewport user-scalable=no

---

- 创建一个 common.styl 文件
- 不叫 css 叫 styl 后缀的文件
- 不需要敲冒号了
- 今天讲的是 css 工程化
- styl 是我们预编译文件，还是需要转为 css 文件才可以编写
  为什么没有设置文字颜色属性，文字颜色为黑色？
  css 有些属性是会直接继承的
  为什么要继承呢？
  每个都要写一遍 无法接受 (默认会有继承特性)
  默认文字大小 16px 颜色黑色
  继承也不是一味的继承
- 如何在手机上面跑起来？
  让电脑连接手机的局域网
