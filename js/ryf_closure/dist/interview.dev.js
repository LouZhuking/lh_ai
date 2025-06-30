"use strict";

// function fun(){
//   var a = 10
//   return function(){
//     console.log(a);
//   }
// }
// fun()()
var lis = document.getElementsByTagName('li');

for (var i = 0; i < lis.length; i++) {
  (function (i) {
    lis[i].onclick = function () {
      alert(i);
    };
  })(i);
}