// 向Function.prototype添加自定义的myApply方法
// context: 函数执行时的上下文对象，即this指向
// args: 函数执行时传递的参数数组或类数组
Function.prototype.myApply=function(context,args){
    // 类型检查：确保调用myApply的对象是一个函数
    if(typeof this !=='function'){
        throw new TypeError('Type Error')
    }
    
    // 如果context为null或undefined，将其设置为全局对象
    // 在浏览器中globalThis指向window，在Node.js中指向global
    if(context ===null || context===undefined){
        context=globalThis
    }
    
    // 创建一个唯一的Symbol作为属性名，避免污染原对象
    const fn=Symbol('')
    
    // 将当前函数(this)作为context对象的一个临时方法
    context[fn]=this
    
    // 调用这个临时方法，并传入args数组中的参数
    // 使用扩展运算符(...)将数组展开为多个参数
    const res=context[fn](...args)
    
    // 删除临时添加的方法，清理context对象
    delete context[fn]
    
    // 返回函数调用的结果
    return res
}

Function.prototype.myBind=function(context,...args){
    if(typeof this !=='function'){
        throw new TypeError('Type Error')
    }
    if(context ===null || context===undefined){
        context=globalThis
    }
    fn1=this
    function fn2(...Args){
        if(this instanceof fn2){
            return fn1.call(this,...args,...Args)
        }else{
            return fn1.call(context,...args,...Args)
        }
    }
    fn2.prototype=Object.create(this.prototype)
    return fn2
}