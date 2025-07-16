/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
  // 定义快慢指针，当慢指针有追上快指针的时候即有环
  let slow = head;
  let fast = head;
  while(fast !== null && fast.next !== null){
      slow = slow.next;
      fast = fast.next.next;
      if(slow === fast){
          return true;
      }
  }
  return false;
};