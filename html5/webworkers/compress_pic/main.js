// 主线程， 单线程           // 本文件运行在浏览器主线程
// event loop               // 事件循环：异步任务（如 worker 消息、文件读取）通过它回调
// 启动一个web worker 线程    // 使用 Web Worker 开启新线程
// 压缩线程                  // 该 worker 专门负责图片压缩

const worker = new Worker('./compressWorker.js'); // 创建 Web Worker，加载压缩脚本
worker.onmessage = function(e){                   // 监听 worker 回传的消息
  console.log(e);                                 // 调试：打印消息对象
  if(e.data.success){                             // 压缩成功时
    // 将压缩结果插入页面的输出容器，展示图片
    document.getElementById('output').innerHTML = `
      <img src="${e.data.data}">
    `
    
  }
  if(e.data.error){                               // 压缩失败时
    console.log(e.data.error);                    // 打印错误信息便于排查
  }
}

function handleFile(file){                        // 将 File 对象读为 DataURL（base64）
  return new Promise((resolve,reject) => {        // 用 Promise 封装异步读取
    const reader = new FileReader();              // 创建文件读取器
    reader.onload = () => resolve(reader.result); // 读取完成后返回结果
    reader.readAsDataURL(file);                   // 以 DataURL 格式读取（适合传给 worker）
  })
}

async function compressFile(file){                // 压缩入口函数
  const imgDataUrl = await handleFile(file);      // 等待读取到图片 DataURL
  // console.log(imgDataUrl,'/////');             // 可选调试：查看 base64
  // 干复杂计算的同时不影响页面性能               // 复杂计算放到 worker 中避免卡顿
  worker.postMessage({                            // 向 worker 发送压缩任务
    imgData: imgDataUrl,                          // 待压缩的图片 base64 数据
    quality: 0.3                                  // 压缩质量（0~1，越小压缩越强）
  })
}

const oFile = document.getElementById('fileInput');    // 获取文件选择输入框
oFile.addEventListener('change',async function(e){      // 监听选择文件事件
  const file = e.target.files[0];                       // 取用户选择的第一个文件
  if(!file) return;                                     // 未选择文件则直接返回
  await compressFile(file);                             // 读取并发送给 worker 进行压缩
})

