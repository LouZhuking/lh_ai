const target = {
    field1: 1,
    field2: undefined,
    field3: 'hxt',
    field4: {
        child: 'child',
        child2: {
            child2: 'child2'
        }
    },
    field5: [1, 2, 3]
}
target.target = target; // 循环引用
// es6 的新数据类型 hash Map
function clone(target,map = new Map()){
  if(typeof target === 'object'){
    let cloneTarget = Array.isArray(target) ? [] : {}
    for(const key in target){
      cloneTarget[key] = clone(target[key])
    }
    return cloneTarget
  }else{
    return target
  }
}