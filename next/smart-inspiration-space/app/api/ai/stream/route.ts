import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { streamChatCompletion, predefinedTools, executeToolFunction } from '@/lib/ai'
import { z } from 'zod'

const streamRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string()
  })),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  useTools: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const validation = streamRequestSchema.safeParse(body)

    if (!validation.success) {
      return new Response('Invalid request data', { status: 400 })
    }

    const { messages, temperature, maxTokens, useTools } = validation.data

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          const streamOptions = {
            temperature,
            maxTokens,
            tools: useTools ? predefinedTools : undefined
          }

          // 开始流式处理
          for await (const chunk of streamChatCompletion(messages, streamOptions)) {
            if (typeof chunk === 'string') {
              // 普通文本内容
              const data = JSON.stringify({ type: 'content', data: chunk })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            } else if (chunk.type === 'tool_calls') {
              // 工具调用
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))

              // 执行工具函数
              for (const toolCall of chunk.data) {
                try {
                  const result = await executeToolFunction(
                    toolCall.function.name,
                    JSON.parse(toolCall.function.arguments)
                  )

                  const toolResult = JSON.stringify({
                    type: 'tool_result',
                    data: {
                      tool_call_id: toolCall.id,
                      result
                    }
                  })

                  controller.enqueue(encoder.encode(`data: ${toolResult}\n\n`))
                } catch (error) {
                  const errorResult = JSON.stringify({
                    type: 'tool_error',
                    data: {
                      tool_call_id: toolCall.id,
                      error: error instanceof Error ? error.message : 'Unknown error'
                    }
                  })

                  controller.enqueue(encoder.encode(`data: ${errorResult}\n\n`))
                }
              }
            }
          }

          // 结束流
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()

        } catch (error) {
          console.error('Stream error:', error)
          const errorData = JSON.stringify({
            type: 'error',
            data: error instanceof Error ? error.message : 'Unknown error'
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Stream API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
