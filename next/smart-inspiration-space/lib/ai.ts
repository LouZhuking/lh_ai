// AI 客户端配置
// 支持多种AI提供商：OpenAI, DeepSeek, Gemini等

interface AIProvider {
  name: string
  apiKey?: string
  baseURL?: string
  model: string
  supportsTools?: boolean
  supportsStreaming?: boolean
}

const providers: Record<string, AIProvider> = {
  openai: {
    name: 'OpenAI',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    supportsTools: true,
    supportsStreaming: true
  },
  deepseek: {
    name: 'DeepSeek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    supportsTools: true,
    supportsStreaming: true
  }
}

// Function Tool 定义
export interface FunctionTool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, {
        type: string
        description: string
        enum?: string[]
      }>
      required: string[]
    }
  }
}

// 预定义的工具
export const predefinedTools: FunctionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_knowledge_base',
      description: '在知识库中搜索相关信息',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜索查询词'
          },
          category: {
            type: 'string',
            description: '搜索分类',
            enum: ['spaces', 'posts', 'users', 'tags']
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_knowledge_note',
      description: '创建新的知识笔记',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: '笔记标题'
          },
          content: {
            type: 'string',
            description: '笔记内容'
          },
          tags: {
            type: 'string',
            description: '标签，用逗号分隔'
          }
        },
        required: ['title', 'content']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'analyze_writing_style',
      description: '分析文本的写作风格和特点',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: '要分析的文本'
          }
        },
        required: ['text']
      }
    }
  }
]

// 获取可用的AI提供商
export function getAvailableProvider(): AIProvider | null {
  // 优先使用 DeepSeek
  if (providers.deepseek.apiKey) {
    return providers.deepseek
  }

  if (providers.openai.apiKey) {
    return providers.openai
  }

  return null
}

// AI 聊天完成请求
export async function chatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    temperature?: number
    maxTokens?: number
    provider?: string
    tools?: FunctionTool[]
    stream?: boolean
  } = {}
) {
  const provider = options.provider
    ? providers[options.provider]
    : getAvailableProvider()

  if (!provider || !provider.apiKey) {
    throw new Error('No AI provider available')
  }

  const url = provider.baseURL
    ? `${provider.baseURL}/chat/completions`
    : 'https://api.openai.com/v1/chat/completions'

  const body: {
    model: string
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
    temperature: number
    max_tokens: number
    [key: string]: unknown
  } = {
    model: provider.model,
    messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
  }

  // 添加工具支持
  if (options.tools && provider.supportsTools) {
    body.tools = options.tools
    body.tool_choice = 'auto'
  }

  // 添加流式输出支持
  if (options.stream && provider.supportsStreaming) {
    body.stream = true
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`)
  }

  return response
}

// 流式聊天完成
export async function* streamChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    temperature?: number
    maxTokens?: number
    provider?: string
    tools?: FunctionTool[]
  } = {}
) {
  const response = await chatCompletion(messages, { ...options, stream: true })

  if (!response.body) {
    throw new Error('No response body for streaming')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          if (data === '[DONE]') {
            return
          }

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta

            if (delta?.content) {
              yield delta.content
            }

            // 处理工具调用
            if (delta?.tool_calls) {
              yield { type: 'tool_calls', data: delta.tool_calls }
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// 工具函数执行器
export async function executeToolFunction(
  name: string,
  args: { [key: string]: unknown }
): Promise<unknown> {
  switch (name) {
    case 'search_knowledge_base':
      return await searchKnowledgeBase(
        args.query as string,
        args.category as string | undefined
      )

    case 'create_knowledge_note':
      return await createKnowledgeNote(
        args.title as string,
        args.content as string,
        args.tags as string | undefined
      )

    case 'analyze_writing_style':
      return await analyzeWritingStyle(args.text as string)

    default:
      throw new Error(`Unknown tool function: ${name}`)
  }
}

// 搜索知识库
async function searchKnowledgeBase(query: string, category?: string) {
  try {
    const params = new URLSearchParams({ q: query })
    if (category) params.append('category', category)

    const response = await fetch(`/api/search?${params}`)
    if (!response.ok) throw new Error('Search failed')

    return await response.json()
  } catch (error) {
    return { error: 'Failed to search knowledge base', query }
  }
}

// 创建知识笔记
async function createKnowledgeNote(title: string, content: string, tags?: string) {
  try {
    const response = await fetch('/api/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: content.substring(0, 200),
        tags: tags ? tags.split(',').map(t => t.trim()) : []
      })
    })

    if (!response.ok) throw new Error('Failed to create note')

    return await response.json()
  } catch (error) {
    return { error: 'Failed to create knowledge note', title }
  }
}

// 分析写作风格
async function analyzeWritingStyle(text: string) {
  const wordCount = text.split(/\s+/).length
  const sentenceCount = text.split(/[.!?]+/).length
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount)

  const complexity = avgWordsPerSentence > 20 ? '复杂' :
    avgWordsPerSentence > 15 ? '中等' : '简单'

  const tone = text.includes('?') ? '疑问' :
    text.includes('!') ? '感叹' : '陈述'

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    complexity,
    tone,
    readability: complexity === '简单' ? '易读' : complexity === '中等' ? '中等' : '较难'
  }
}

// AI 功能函数

// 内容摘要
export async function summarizeContent(content: string): Promise<string> {
  const messages = [
    {
      role: 'system' as const,
      content: '你是一个专业的内容摘要助手。请为用户提供的内容生成简洁、准确的摘要。'
    },
    {
      role: 'user' as const,
      content: `请为以下内容生成摘要：\n\n${content}`
    }
  ]

  try {
    const response = await chatCompletion(messages, { maxTokens: 200 })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || '无法生成摘要'
  } catch (error) {
    console.error('Summarize error:', error)
    return '摘要生成失败'
  }
}

// 内容扩写
export async function expandContent(content: string, style?: string): Promise<string> {
  const stylePrompt = style ? `以${style}的风格` : ''

  const messages = [
    {
      role: 'system' as const,
      content: `你是一个专业的写作助手。请帮助用户扩展和丰富内容，${stylePrompt}使内容更加详细和有趣。`
    },
    {
      role: 'user' as const,
      content: `请扩写以下内容：\n\n${content}`
    }
  ]

  try {
    const response = await chatCompletion(messages, { maxTokens: 800 })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || '无法扩写内容'
  } catch (error) {
    console.error('Expand error:', error)
    return '内容扩写失败'
  }
}

// 生成标签
export async function generateTags(content: string): Promise<string[]> {
  const messages = [
    {
      role: 'system' as const,
      content: '你是一个专业的内容分析师。请为用户提供的内容生成3-5个相关的标签，用逗号分隔。'
    },
    {
      role: 'user' as const,
      content: `请为以下内容生成标签：\n\n${content}`
    }
  ]

  try {
    const response = await chatCompletion(messages, { maxTokens: 100 })
    const data = await response.json()
    const tagsText: string = data.choices?.[0]?.message?.content || ''
    return tagsText.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
  } catch (error) {
    console.error('Generate tags error:', error)
    return []
  }
}

// 改善写作
export async function improveWriting(content: string, instruction?: string): Promise<string> {
  const customInstruction = instruction || '改善语言表达，使其更加清晰和流畅'

  const messages = [
    {
      role: 'system' as const,
      content: '你是一个专业的写作指导老师。请根据用户的要求改善文本内容。'
    },
    {
      role: 'user' as const,
      content: `请根据以下要求改善文本：${customInstruction}\n\n原文：\n${content}`
    }
  ]

  try {
    const response = await chatCompletion(messages, { maxTokens: 1000 })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || '无法改善内容'
  } catch (error) {
    console.error('Improve writing error:', error)
    return '写作改善失败'
  }
}

// 翻译内容
export async function translateContent(content: string, targetLang: string = '英文'): Promise<string> {
  const messages = [
    {
      role: 'system' as const,
      content: `你是一个专业的翻译助手。请将用户提供的内容翻译成${targetLang}。`
    },
    {
      role: 'user' as const,
      content: `请翻译以下内容：\n\n${content}`
    }
  ]

  try {
    const response = await chatCompletion(messages, { maxTokens: 1000 })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || '无法翻译内容'
  } catch (error) {
    console.error('Translate error:', error)
    return '翻译失败'
  }
}

// 发现关联
export async function findRelatedConcepts(content: string): Promise<string[]> {
  const messages = [
    {
      role: 'system' as const,
      content: '你是一个知识连接专家。请分析用户提供的内容，找出3-5个相关的概念或主题，用逗号分隔。'
    },
    {
      role: 'user' as const,
      content: `请分析以下内容并找出相关概念：\n\n${content}`
    }
  ]

  try {
    const response = await chatCompletion(messages, { maxTokens: 200 })
    const data = await response.json()
    const conceptsText: string = data.choices?.[0]?.message?.content || ''
    return conceptsText
      .split(',')
      .map((concept: string) => concept.trim())
      .filter((concept: string) => concept.length > 0)
  } catch (error) {
    console.error('Find related concepts error:', error)
    return []
  }
}
