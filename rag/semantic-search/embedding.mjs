// 负责 posts.json的模块化
// 支持了fs的promise 版本
import fs from 'fs/promises'
// readFileSync 同步
// readFile() 异步 callback
// fs 推出了promise版本
import { client } from './llm.mjs'

const inputFilePath = './data/posts.json'
const outputFilePath = './data/posts_with_embedding.json'
// 最流行写法
const data = await fs.readFile(inputFilePath, "utf-8")
console.log(data);
// 向量化
const posts = JSON.parse(data)

const postsWithEmbedding = []

for(const {title,category} of posts){
  // console.log(title, category, '---------');
  const response = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: `标题: ${title}; 分类: ${category}`
  })
  postsWithEmbedding.push({
    title,
    category,
    embeddings: response.data[0].embedding
  })
}
// 会有文章表，表单中需要有搜索功能
// 会生成embedding数据库，与原有的数据进行向量比较

await fs.writeFile(outputFilePath,
   JSON.stringify(
    postsWithEmbedding,
    null,
    2
   )
)