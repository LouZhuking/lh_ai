// 枚举类型
const STATUS = {
    // 常量
    READY: Symbol('ready'), // 准备状态
    RUNNING: Symbol('running'), // 运行状态
    DONE: Symbol('done'), // 完成状态
}

let state = STATUS.READY; // 初始状态为准备状态
if(state === STATUS.READY){
  console.log('ready');
}