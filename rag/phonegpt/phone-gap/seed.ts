// supabase 去做向量化的知识库数据
import { createOpenAI } from "@ai-sdk/openai";
// langchain  loader 是 RAG的基础功能 txt,pdf,excel....
// 加载网页内容
import {
  PuppeteerWebBaseLoader
} from '@langchain/community/document_loaders/web/puppeteer'
import {
  RecursiveCharacterTextSplitter
} from 'langchain/text_splitter'

import {
  embed  // 向量嵌入，文本转向量
} from 'ai'

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? "",
)

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL
})
console.log('开始向量化知识库数据');

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512, // 切割的长度 512 个字符 包含一个比较独立的语义
  chunkOverlap: 100 // 切割的重叠长度 100 个字符
})

const scrapePage = async (url: string): Promise<string> => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      executablePath: "C:\\Users\\楼主KING\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,

    },
    gotoOptions: {
      waitUntil: 'networkidle0',
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    }
  });
  // gm 正则修饰符
  // ^在[^>] 表示不是> 的字符
  return (await loader.scrape()).replace(/<[^>]*>?/gm, '');
}
const loadData = async (webpages: string[]) => {
  for (const url of webpages) {
    const content = await scrapePage(url);
    // console.log(content);
    const chunks = await splitter.splitText(content)
    // console.log(chunks, '--------------');
    for (let chunk of chunks) {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: chunk
      })
      console.log(embedding);
      const { error } = await supabase.from('chunks').insert({
        content: chunk,
        vector: embedding,
        url: url
      })
      if (error) {
        console.error('Insert error:', error)
      }
    }
  }


}

// 维护一个知识库，知识库的来源可配置
loadData([
  "https://www.lovepet.cn/a/gougoubaike/218693.html",
  "https://www.lovepet.cn/a/maomibaike/bo-si-mao-xing-zou-de-mao-rong-yi-shu-pin.html",
  "https://www.lovepet.cn/a/gougoubaike/218694.html",
  "https://www.lovepet.cn/a/gougouzixun/quwei/2020/0716/14952.html",
  // "https://en.wikipedia.org/wiki/IPhone_15",
  // "https://en.wikipedia.org/wiki/IPhone_15_Pro",
]);