'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Send,
  Bot,
  User,
  Loader2,
  Settings,
  Trash2,
  Copy
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  toolCalls?: unknown[]
  toolResults?: unknown[]
}

interface AIChatProps {
  systemPrompt?: string
  title?: string
  placeholder?: string
}

export function AIChat({
  systemPrompt = "你是一个智能助手，可以帮助用户管理知识、分析内容和回答问题。",
  title = "AI 智能助手",
  placeholder = "输入你的问题..."
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useTools, setUseTools] = useState(true)
  const [temperature, setTemperature] = useState(0.7)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ))
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "对话已清空",
      description: "所有消息已被删除"
    })
  }

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "已复制到剪贴板",
        description: "消息内容已复制"
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive"
      })
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // 添加用户消息
    addMessage({
      role: 'user',
      content: userMessage
    })

    // 添加加载中的助手消息
    const assistantMessageId = addMessage({
      role: 'assistant',
      content: ''
    })

    setIsLoading(true)

    try {
      // 构建消息历史
      const messageHistory = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ]

      // 发起流式请求
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory,
          temperature,
          useTools
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') {
                break
              }

              try {
                const parsed = JSON.parse(data)

                if (parsed.type === 'content') {
                  accumulatedContent += parsed.data
                  updateMessage(assistantMessageId, {
                    content: accumulatedContent
                  })
                }

                if (parsed.type === 'tool_calls') {
                  updateMessage(assistantMessageId, {
                    toolCalls: parsed.data,
                    content: accumulatedContent + '\n\n🔧 正在调用工具...'
                  })
                }

                if (parsed.type === 'tool_result') {
                  const { tool_call_id, result } = parsed.data
                  updateMessage(assistantMessageId, {
                    content: accumulatedContent + `\n\n✅ 工具执行成功: ${JSON.stringify(result, null, 2)}`
                  })
                }

                if (parsed.type === 'tool_error') {
                  const { tool_call_id, error } = parsed.data
                  updateMessage(assistantMessageId, {
                    content: accumulatedContent + `\n\n❌ 工具执行失败: ${error}`
                  })
                }

                if (parsed.type === 'error') {
                  throw new Error(parsed.data)
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error)
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error)
      updateMessage(assistantMessageId, {
        content: '抱歉，发生了错误。请稍后重试。'
      })
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* 设置区域 */}
        <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-tools"
              checked={useTools}
              onCheckedChange={setUseTools}
            />
            <Label htmlFor="use-tools" className="text-sm">
              {/* <Tool className="inline h-3 w-3 mr-1" /> */}
              启用工具
            </Label>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center space-x-2">
            <Label htmlFor="temperature" className="text-sm">
              <Settings className="inline h-3 w-3 mr-1" />
              创造性:
            </Label>
            <select
              id="temperature"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="text-xs bg-background border rounded px-2 py-1"
            >
              <option value={0.1}>保守</option>
              <option value={0.5}>平衡</option>
              <option value={0.7}>创意</option>
              <option value={1.0}>发散</option>
            </select>
          </div>
        </div>

        {/* 消息区域 */}
        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>开始与AI助手对话吧！</p>
                <p className="text-sm mt-2">
                  {useTools ? '已启用工具功能，可以搜索知识库、创建笔记等' : '纯对话模式'}
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                    }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <div className={`rounded-lg p-3 ${message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                    }`}>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>

                    {message.toolCalls && (
                      <div className="mt-2 pt-2 border-t border-border/20">
                        <Badge variant="outline" className="text-xs">
                          {/* <Tool className="mr-1 h-3 w-3" /> */}
                          工具调用
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{formatTimestamp(message.timestamp)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">
                      AI正在思考...
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* 输入区域 */}
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
