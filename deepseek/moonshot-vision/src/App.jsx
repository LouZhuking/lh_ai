import { useState } from 'react'
import './App.css'

function App() {
  console.log(import.meta.env.VITE_API_KEY);
  // react 内置的hook (钩子) 函数 快速的解决一些问题 响应式的数据状态
  // useRef DOM 等对象的绑定
  const [content, setContent] = useState('')
  const [imgBase64Data, setImgBase64Data] = useState('')
  const [isValid, setIsValid] = useState(false)

  // base64? google 推出的编码方案
  // 定义文件上传处理函数，接收事件对象 e
  const updateBase64Data = (e) => {
    // 获取用户选择的第一个文件（HTML5 文件交互 API）
    const file = e.target.files[0];
    // 调试用：打印文件信息（已注释）
    // console.log(file);
    // 如果没有选择文件，直接返回
    if (!file) return;
    // 使用 HTML5 FileReader API 读取文件内容
    const reader = new FileReader();
    // 以 DataURL 格式读取文件（会转换为 Base64 编码）
    reader.readAsDataURL(file);
    // 文件读取是异步操作，通过 onload 事件处理加载完成后的逻辑
    reader.onload = () => {
      // 调试用：打印 Base64 编码结果（已注释）
      // console.log(reader.result);
      // 将 Base64 数据保存到组件状态
      setImgBase64Data(reader.result)
      // 将文件验证状态设为有效
      setIsValid(true)
    }
  }


  const update = async () => {
    if (!imgBase64Data) return;
    const endpoint = 'https://api.moonshot.cn/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      // 授权码 Bearer 一般都会带 
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
    }
    // 实时反馈给用户
    setContent('正在生成...')
    const response = await fetch(
      endpoint,
      {
        method: 'POST',
        headers, // es6中 JSON key value 一样可以省略
        body: JSON.stringify({
          model: 'moonshot-v1-8k-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: "image_url",
                  image_url: {
                    "url": imgBase64Data
                  }
                },
                {
                  type: "text",
                  text: "请详细描述图片"
                }
              ]
            }
          ]
        })
      }
    )
    // 二进制字节流 json 也是异步的
    const data = await response.json()
    setContent(data.choices[0].message.content)
  }

  return (
    <div className='container'>
      <div>
        <label htmlFor="fileInput">文件：</label>
        <input
          type="file"
          id='fileInput'
          className='input'
          accept='.jpeg,.jpg,.png,.gif'
          onChange={updateBase64Data}
        />
        <button onClick={update} disabled={!isValid}>提交</button>
      </div>
      <div className="output">
        <div className="preview">
          {
            imgBase64Data && <img src={imgBase64Data} alt="" />
          }
        </div>
        <div>
          {content}
        </div>
      </div>
    </div>
  )
}

export default App
