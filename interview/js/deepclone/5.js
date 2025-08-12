const target = {
  a: 1
}
// 如果原对象是简单数据类型，忽略
Object.assign(target, null)
Object.assign(target, undefined)
console.log(target);


// Cannot convert undefined or null to object
// Object.assign(undefined, {a: 1})

