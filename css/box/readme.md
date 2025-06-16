## 盒子模型

- 文档流
  doctype
  从上到下(块),  从左到右,   像水流一样实现我们的页面  流体布局
  html 标签 从外到内(层级) ， 从上到下(布局 盒子能力)  从左到右(布局)
- html 元素的时候  ,  一个盒子
- 盒子，  页面的占位就清楚了。
  - 盒子的尺寸 由哪些部分构成 ？
    - 内容  width x height
    - 内边距 padding
    - 边框 border
    - 外边距 margin

- 页面怎么显示的？
  - 将元素和css , 了解它作为一个盒子，在文档流中的大小和位置。
  - 盒子模型 = 内容 + 内边距 + 边框 + 外边距 ？
    2种算法
      box-sizing: border-box;

- 布局
  多列

- 页面的实现 = 文档流 + 页面布局(弹性、浮动..) + 盒模型(标准，怪异) + 
离开文档流(position: absolute)


---------------------------------------------------------
<!-- display 可以去切换盒子的能力 -->
box-sizing 可以去设定盒子的计算方案
默认值是 content-box   width height 指定的是内容的大小 标准盒模型
border-box wxh 包含了border 以内的大小 怪异盒(IE)模型
box-sizing 不管内边距的，因此要管margin
box-sizing: border-box;

将盒子模型改变为box-sizing: content-box;

display: flex;   display: 1;

