// 定义深拷贝函数，接收目标对象和用于检测循环引用的WeakMap参数
function deepClone(target, map = new WeakMap()) {
    // 基础类型或null直接返回（无需深拷贝）
    // typeof null 返回 'object'，所以需要单独判断null
    if (typeof target !== 'object' || target === null) {
        return target;
    }
    
    // 检查是否已拷贝过该对象（处理循环引用）
    if (map.has(target)) {
        // 如果已拷贝过，直接返回之前拷贝的对象，避免无限递归
        return map.get(target);
    }
    
    // 根据目标对象类型创建克隆对象（数组或普通对象）
    const cloneTarget = Array.isArray(target) ? [] : {};
    // 记录目标对象与克隆对象的映射关系，用于后续检测循环引用
    map.set(target, cloneTarget);
    
    // 遍历目标对象的所有可枚举属性
    for (const key in target) {
        // 只处理对象自身的属性，不包含从原型链继承的属性
        if (target.hasOwnProperty(key)) {
            // 递归拷贝每个属性的值
            cloneTarget[key] = deepClone(target[key], map);
        }
    }
    
    // 返回深拷贝后的克隆对象
    return cloneTarget;
}

console.log(deepClone({a:1,b:{c:2}}));
