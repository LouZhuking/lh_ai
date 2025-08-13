"use strict";

var _source;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var s = Symbol('id'); // 独一无二

var source = (_source = {}, _defineProperty(_source, s, 123), _defineProperty(_source, "a", 1), _source);
var target = [];
Object.assign(target, source);
console.log(target);