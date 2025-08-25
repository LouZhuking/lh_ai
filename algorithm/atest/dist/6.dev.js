"use strict";

// 1. Undefined 类型转换为 NaN
console.log(Number(undefined)); // NaN
// 2. Null 类型转换为 0

console.log(Number(null)); // 0
// 3. Boolean 类型转换

console.log(Number(true)); // 1

console.log(Number(false)); // 0
// 4. String 类型转换（使用 Number() 函数规则）

console.log(Number("123")); // 123

console.log(Number("12.5")); // 12.5

console.log(Number("")); // 0 （空字符串）

console.log(Number("   ")); // 0 （仅空白字符，也会转为 0）

console.log(Number("abc")); // NaN

console.log(Number("123abc")); // NaN

console.log(Number("true")); // NaN （虽然是布尔字符串，但不解析）
// 5. Symbol 类型不能转换为数字，会抛出错误

var sym = Symbol("test");

try {
  console.log(Number(sym)); // 抛出 TypeError
} catch (e) {
  console.log("Error:", e.message); // Error: Cannot convert a Symbol value to a number
} // 补充：使用一元加号（+）操作符也会触发相同的转换规则


console.log(+undefined); // NaN

console.log(+null); // 0

console.log(+true); // 1

console.log(+false); // 0

console.log(+""); // 0

console.log(+"123"); // 123

console.log(+"xyz"); // NaN
// 注意：Symbol 使用 + 也会报错

try {
  console.log(+sym);
} catch (e) {
  console.log("Error with +:", e.message); // Error with +: Cannot convert a Symbol value to a number
}