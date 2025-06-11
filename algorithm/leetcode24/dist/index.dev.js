"use strict";

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function swapPairs(head) {
  var dummyHead = new ListNode(0);
  dummyHead.next = head;
  var temp = dummyHead;

  while (temp.next !== null && temp.next.next !== null) {
    var node1 = temp.next;
    var node2 = temp.next.next;
    temp.next = node2; // 头节点指向节点2

    node1.next = node2.next;
    node2.next = node1; // 节点二指向节点1   
    // 将头节点指向节点3的前驱节点
    // 1-2-3-4 ->  2-1-3-4 即指向为3的前一节点

    temp = node1;
  }

  return dummyHead.next;
};