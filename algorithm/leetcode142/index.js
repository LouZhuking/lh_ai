/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

// /**
//  * @param {ListNode} head
//  * @return {ListNode}
//  */
// var detectCycle = function(head) {
//   if(head === null){
//       return null;
//   }
//   // 1. 定义快指针和慢指针，快指针每次移动2，慢指针每次移动1
//   let fast = head;
//   let slow = head;
//   while(fast !==null && fast.next !==null){
//     fast = fast.next.next;
//     slow = slow.next;
//     // 2.当两指针相遇时，记录该位置,并从头定义指针开始追
//     if(fast === slow){
//       let index1 = fast;
//       let index2 = head;
//       while(index1 !== index2){
//         // 3.index1跟随快指针在环中走，直至被index2追上
//         index1 = index1.next;
//         index2 = index2.next;
//       }
//       return index1;
//     }
//   }
//     return null;


// };
// head = [3,2,0,-4]
// pos = 1
// console.log(detectCycle(head));


var detectCycle = function(head) {
  if (head === null) {
      return null;
  }
  let slow = head, fast = head;
  while (fast !== null) {
      slow = slow.next;
      if (fast.next !== null) {
          fast = fast.next.next;
      } else {
          return null;
      }
      if (fast === slow) {
          let ptr = head;
          while (ptr !== slow) {
              ptr = ptr.next;
              slow = slow.next;
          }
          return ptr;
      }
  }
  return null;
};

head = [3,2,0,-4]
pos = 1
console.log(detectCycle(head));