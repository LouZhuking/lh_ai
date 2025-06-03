# 类型判断
## 刻意练习
- 编写一个 add 函数 a + b 相加， 返回结果

## JS 数据类型
 - primitive 原始类型 栈内存
     拷贝式传值
   string number undefined null boolean bigint symbol
 - 复杂数据类型 栈内存 (连续) (地址的引用) + 堆内存 (对象的内容)
     引用式赋值
  object 
  JS 有哪些数据类型？
  七种
  string object null undefined symbol numeric 6种primitive 简单类型，其中numeric 又分为 number 和 bigint.
  其它的都是复杂数据类型。

## ECMA
  - JS 是 ECMA 语法规范的一个版本
  - JavaScript 和 Java 没有关系

## Symbol
es6 新增的一种数据类型
- 唯一值

--------------------------------------------------
JavaScript 共有 8 种数据类型，分为 7 种原始类型（Primitive Types）和 1 种引用类型（Reference Types）：

### 原始类型（值直接存储在栈内存中）
- string （字符串）：表示文本数据。
- number （数值）：表示整数或浮点数（包括 NaN 、 Infinity 等特殊值）。
- boolean （布尔值）：仅 true 或 false 。
- undefined （未定义）：变量声明但未赋值时的默认值。
- null （空值）：显式表示“无值”。
- symbol （符号）：ES6 新增，用于创建唯一且不可变的标识符（ Symbol() ）。
- bigint （大整数）：ES2020 新增，用于表示超过 Number.MAX_SAFE_INTEGER 的大整数（ 123n 格式）。
### 引用类型（值存储在堆内存中，变量存储引用地址）
- object （对象）：包括普通对象、数组（ Array ）、函数（ Function ）、日期（ Date ）等。

Numeric: Number 和 BigInt 类型。

####
枚举类型是一组具名常量的集合，用于定义有限、明确的取值，提升代码可读性。