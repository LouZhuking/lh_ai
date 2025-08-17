"use strict";

var MyQueue = function MyQueue() {
  // 构造函数：初始化两个空数组作为栈
  this.stackIn = []; // 输入栈：用于存储新加入的元素

  this.stackOut = []; // 输出栈：用于弹出和查看元素
};
/** 
 * @param {number} x
 * @return {void}
 */


MyQueue.prototype.push = function (x) {
  // 入队操作：直接将元素压入输入栈
  this.stackIn.push(x);
};
/**
 * @return {number}
 */


MyQueue.prototype.pop = function () {
  // 出队操作：移除并返回队列的第一个元素
  var size = this.stackOut.length;

  if (size) {
    // 如果输出栈有元素，直接从输出栈弹出
    return this.stackOut.pop();
  } // 如果输出栈为空，将输入栈的所有元素转移到输出栈


  while (this.stackIn.length) {
    // 将输入栈的元素逐个弹出并压入输出栈
    // 这样最先进入输入栈的元素就到了输出栈的顶部
    this.stackOut.push(this.stackIn.pop());
  } // 从输出栈弹出元素（这就是队列的第一个元素）


  return this.stackOut.pop();
};
/**
 * @return {number}
 */


MyQueue.prototype.peek = function () {
  // 查看队列的第一个元素但不移除
  var x = this.pop(); // 先调用pop()获取第一个元素

  this.stackOut.push(x); // 因为pop()移除了元素，所以需要再放回去

  return x; // 返回第一个元素的值
};
/**
 * @return {boolean}
 */


MyQueue.prototype.empty = function () {
  // 判断队列是否为空
  // 只有当两个栈都为空时，队列才为空
  return !this.stackIn.length && !this.stackOut.length;
};
/** 
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */