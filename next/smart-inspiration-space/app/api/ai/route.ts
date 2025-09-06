import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  summarizeContent,
  expandContent,
  generateTags,
  improveWriting,
  translateContent,
  findRelatedConcepts,
  getAvailableProvider
} from '@/lib/ai'
import { z } from 'zod'

const aiRequestSchema = z.object({
  action: z.enum([
    'summarize',
    'expand',
    'generate_tags',
    'improve',
    'translate',
    'find_related'
  ]),
  content: z.string().min(1),
  options: z.object({
    style: z.string().optional(),
    targetLang: z.string().optional(),
    instruction: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 检查是否有可用的AI提供商
    const provider = getAvailableProvider()
    if (!provider) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validation = aiRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { action, content, options = {} } = validation.data

    let result: any

    switch (action) {
      case 'summarize':
        result = await summarizeContent(content)
        break

      case 'expand':
        result = await expandContent(content, options.style)
        break

      case 'generate_tags':
        result = await generateTags(content)
        break

      case 'improve':
        result = await improveWriting(content, options.instruction)
        break

      case 'translate':
        result = await translateContent(content, options.targetLang || '英文')
        break

      case 'find_related':
        result = await findRelatedConcepts(content)
        break

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      action,
      result,
      provider: provider.name
    })

  } catch (error) {
    console.error('AI API error:', error)

    if (error instanceof Error && error.message.includes('AI API error')) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const provider = getAvailableProvider()

    return NextResponse.json({
      available: !!provider,
      provider: provider?.name || null,
      features: [
        'summarize',
        'expand',
        'generate_tags',
        'improve',
        'translate',
        'find_related'
      ]
    })
  } catch (error) {
    console.error('AI status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
