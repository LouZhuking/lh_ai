# Array 的高级考点？

- 怎么认识数组？
    - 可遍历的对象
- new Array(5)
    类似于c++,固定大小的分配 v8 引擎对arr 设计
    - 灵活地扩展,不限类型, 还有hash的特性
    - empty*5 key 没有释放 for key in 不可以迭代
    - fill Array(5).fill(undefined) 统一的
- [] 数组字面量
    ['zhl','zjc','zjs','zjl',...arr]

![image-20250718105332539](C:\Users\楼主KING\AppData\Roaming\Typora\typora-user-images\image-20250718105332539.png)

- 静态方法
    Array.of(1,2,3)  // 已经有了数据
    Array.from() // 转换，(类数组， 填充计算)