// 用泛型去声明一个链表
// 数据结构,ADT(抽象数据类型)

// 支持泛型的节点类，T是类型参数，用于指定节点值的类型
// <T> 是TypeScript泛型语法，表示这是一个可以接受不同类型参数的类
class NodeItem<T>{
  // 定义节点的值属性，类型为泛型T
  value: T;
  
  // 定义指向下一个节点的引用，类型为联合类型：NodeItem<T> 或 null
  // 这是TypeScript的类型安全特性，明确指出next可能为null
  next: NodeItem<T> | null = null;
  
  // 构造函数，接收类型为T的值作为参数
  constructor(value: T){
    this.value = value;
  }
}

// 定义泛型链表类，同样使用类型参数T
class LinkedList<T> {
  // 定义链表的头节点，类型为联合类型：NodeItem<T> 或 null
  // 初始值设为null，表示空链表
  head: NodeItem<T> | null = null;
  
  // 定义append方法，接收类型为T的值，无返回值(void)
  append(value: T):void {
    // 创建新的节点实例，传入的值必须是类型T
    const newNodeItem = new NodeItem(value);
    
    // 如果链表为空（head为null），则将新节点设为头节点
    if(!this.head){
      this.head = newNodeItem;
      return;
    }
    
    // 遍历链表，找到最后一个节点
    let current = this.head;
    // TypeScript的类型保护：只有当current.next不为null时才会进入循环
    while(current.next){
      current = current.next;
    }
    
    // 在链表尾部添加新节点
    current.next = newNodeItem;
  }
}

// 创建一个存储number类型数据的链表实例
// 这里明确指定泛型参数为number，所以append方法只能接受number类型的值
const numberList = new LinkedList<number>();
numberList.append(1)  // 正确：传入number类型
numberList.append(2)  // 正确：传入number类型
numberList.append(3)  // 正确：传入number类型
// numberList.append('string')  // 错误：TypeScript会在编译时报错，因为类型不匹配

// 定义一个User接口，用于描述用户对象的结构
// 接口是TypeScript的核心特性，用于定义对象的类型形状
interface User {
  id: number;  // id属性必须是number类型
  name: string; // name属性必须是string类型
}

// 创建一个存储User类型对象的链表实例
// 这里明确指定泛型参数为User接口，所以append方法只能接受符合User接口的对象
const userList = new LinkedList<User>();
userList.append({
  id: 2,       // 正确：符合User接口的id字段
  name: "Bob"   // 正确：符合User接口的name字段
  // age: 25   // 如果添加这个字段，TypeScript会报错，因为User接口中没有定义age
})