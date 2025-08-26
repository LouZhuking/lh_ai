"use strict";

function createCounter() {
  var count = 0;
  return {
    inc: function inc() {
      return ++count;
    },
    get: function get() {
      return count;
    }
  };
}

var counter = createCounter;
counter.inc();
counter.inc();
console.log(counter.count); // undefined

console.log(counter.get());