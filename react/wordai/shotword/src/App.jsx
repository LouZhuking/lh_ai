import { useState } from 'react'
import PictureCard from './components/PictureCard'
// uploadImg 太长了 -> generateAudio 模块化 -> 复用 -> lib/audio.js
import { generateAudio } from './lib/audio.js'
import './App.css'

function App() {
  // es6 字符串模版支持多行
  // 
  const picPrompt = `
  分析图片内容,找出最能描述图片的一个英文单词,尽量选择更简单的A1~A2的词汇。
  返回JSON数据:
  {
    "image_description": "图片描述",
    "represent_word": "图片代表的英文单词"
    "example_sentence":"结合英文单词和图片描述，给出一个简单的例句",
    "explain": "结合图片解释英文单词,段落以Look at...开头,将段落分句，每一句单独一行，解释的最后给一个日常生活有关的问句?",
    "explain_replys": ["根据explain给出的回复1","根据explain给出的回复2"]
  }


  `
  // 持有数据状态
  const [word,setWord] = useState("请上传图片")
  const [sentence,setSentence] = useState("")
  const [explain,setExplain] = useState([])
  const [audio,setAudio] = useState("")
  // JSX   react 优势  方便些HTML模版
  const uploadImage = async (imgData)=>{
    // console.log(imgData,'来自父组件的打印')
    setWord("正在分析中...")
    const endpoint = "https://api.moonshot.cn/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`,
      'Content-Type': 'application/json',
    }

    const response = await fetch(endpoint,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        // vision 可视 图片
        model: 'moonshot-v1-8k-vision-preview',
        messages: [
          {
            role: 'user',
            content:[
              {
                type: 'image_url', //   base64图片
                image_url: {"url": imgData}
              },
              {
                type: 'text',
                text: picPrompt
              }
            ]
          }
        ]
      })
    })
    const data = await response.json();
    console.log(data);
    const replyData = JSON.parse(data.choices[0].message.content)
    setWord(replyData.representative_word)
    setSentence(replyData.example_sentence)

    const audioUrl = await generateAudio(replyData.example_sentence)
  }


  return (
    <div className='container'>
      {/* 自定义组件  子组件
      组件 html,css, js 沙子一样， 组合起来, 图片上传功能
      模块化了，复用，页面由dom 树 -》 组件树 */}
      {/* {props} */}
      <PictureCard 
        uploadImage={uploadImage}
        word={word}
        audio={audio}
      />
      <div className="output">
        <div>{sentence}</div>
      </div>
    </div>
  )
}

export default App


// "{
//   "image_description": "A cute, stylized strawberry with a smiling face.",
//   "represent_word": "strawberry",
//   "example_sentence": "I love to eat strawberries in the summer.",
//   "explain": "Look at the picture. It shows a strawberry.\nA strawberry is a red fruit with seeds on the outside.\nIt has a green leafy top.\nStrawberries are sweet and juicy.\nDo you like to eat strawberries with cream?",
//   "explain_replys": ["Yes, strawberries and cream are a classic treat!", "I prefer strawberries on their own, but cream is a nice addition."]
// }
// "