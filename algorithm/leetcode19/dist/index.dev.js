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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function removeNthFromEnd(head, n) {
  // 1. 定义虚拟头节点
  var dummyHead = new ListNode(0);
  dummyHead.next = head; // 2. 定义快慢指针,都指向虚拟头节点

  var fast = dummyHead;
  var slow = dummyHead; // 3. 先移动快指针到n+1的位置

  n++;

  while (n-- && fast !== null) {
    fast = fast.next;
  } // 4.开始快指针慢指针同时开始移动


  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  } // 5. 慢指针到达指定位置并将其next指向next


  slow.next = slow.next.next; // 6. 返回虚拟的头节点

  return dummyHead.next;
};