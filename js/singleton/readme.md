# singleton module 单例模式
  单例模式的定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
  函数 + prototype 完成类 原型式的
  js 的原型式的 灵活、 优雅  (面向对象都不用学) 
  JAVA , C++ 不能理解 es6 为了拥抱更多开发者 企业级大型项目开发
  es6 推出了class关键字

  1.html
  ```js
      class Storage{
      constructor(){
        console.log(this,'~~~');
      }
    }
    const storage1 = new Storage();
  ```
  ```js
      class Storage{
      constructor(){
        console.log(this,'~~~');
      }
      getItem(key){

      }
      setItem(key,value){

      }
    }
    // 使用单例模式性能好
    // new干掉 拿到对象的实例
    const storage1 = new Storage();
    const storage2 = new Storage();
    // 引用 es6 class语法糖 构建类 本质还是原型式的
    console.log(storage1===storage2,'~~~')
    // 可以看到打印的结果都是false那么如何使他们相等呢
  ```
  如何让class只会实例化一次？
  new 干掉 拿到对象的实例
  ```js
    class Storage{
        
      constructor(){
        console.log(this,'~~~');
      }
      getItem(key){

      }
      setItem(key,value){

      }
    }
    const storage1 = Storage.getInstance();
    const storage2 = Storage();
    console.log(storage1===storage2,'~~~')
  ```
    提供了一种语法，抽象类 静态方法 属于类的方法 不用实例化
    public private 属于实例的方法
    
  ```js
    class Storage{
        
      constructor(){
        console.log(this,'~~~');
      }
      // 静态方法
      static getInstance(){
        // 返回一个实例 如果实例化过 返回之前的
        // 第一次的话就返回实例化
        // 如何理解这里的Storage.instance呢 (这里也是静态属性的)
        // es6 class属性只是语法糖 Storage 只是一个对象 instance
        if(!Storage.instance){
          Storage.instance = new Storage();
        }
      }
      getItem(key){

      }
      setItem(key,value){

      }
    }
    const storage1 = Storage.getInstance();
    const storage2 = Storage.getInstance();
    console.log(storage1===storage2,'~~~') // 打印出来为true
  ```

## 单例
单例是一种设计模式(static getInstance), 高级程序的交流语言。
一个类只能实例化一次。
- static 属性 instance 持有唯一的一次实例
- static getInstance 方法 判断 instance 并返回
- 性能特别好， 好管理 实例的时候一定要这样
```js
  <script>
    class Storage{
      static instance;
      constructor(){
        console.log(this,'~~~');
      }
      // 静态方法
      static getInstance(){
        if(!Storage.instance){
          Storage.instance = new Storage();
        }
        return Storage.instance;
      }
      getItem(key){
        return localStorage.getItem(key);
      }
      setItem(key,value){
        return localStorage.setItem(key,value);
      }
    }
    const storage1 = Storage.getInstance();
    const storage2 = Storage.getInstance();
    console.log(storage1===storage2,'~~~')
    storage1.setItem('name','卢老板')
    {/* storage1.setItem('name','娄老板') */}
  </script>
```

2.html (闭包和单例)
```js
    // 回到函数，闭包
    // 自由变量 唯一的实例
  <script>
    
  </script>
```


## 实现Storage, 使得该对象为**单例**， 基于LocalStorage 进行封装。实现方法
setItem(key, value) 和getItem(key)



- 分析题目
实现Storage 类
- 设计模式 design pattern
- 封装
    getItem
    setItem



## 单例模式 下

- 实现一个登录弹窗
    - 用户体验当中不用跳转路由，盖在页面上
    需要使用到 z-index display none|block 
    - 性能 90% 用户 不登录 Modal html css js 比较多
    推迟到第一次用的时候，使用单例模式  使用产品的复用