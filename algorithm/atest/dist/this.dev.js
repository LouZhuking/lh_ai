"use strict";

var _this = void 0;

var count = 100;
var obj = {
  count: 999,
  getCount1: function getCount1() {
    return this.count;
  },
  getCount2: function getCount2() {
    return _this.count;
  },
  getCount3: function getCount3() {
    console.log(_this.count);
  },
  getCount4: function getCount4() {
    var _this2 = this;

    setTimeout(function () {
      console.log(_this2.count);
    }, 0);
  },
  getCount5: function getCount5() {
    var _this3 = this;

    setTimeout(function () {
      console.log(_this3.count);
    }, 0);
  }
}; //res1

console.log(obj.getCount1()); //res2

console.log(obj.getCount2());
var Fn = obj.getCount3; //res3

Fn(); //res4 

obj.getCount4(); //res5

obj.getCount5.call({
  count: 666
});