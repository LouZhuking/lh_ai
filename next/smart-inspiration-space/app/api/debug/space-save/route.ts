import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  // 只在开发环境下提供此端点
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    console.log('=== Space Save Debug ===')
    console.log('Session:', session?.user)
    console.log('Request body:', JSON.stringify(body, null, 2))

    // 检查用户是否登录
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'User not authenticated',
        session: session,
        hasUserId: !!session?.user?.id
      })
    }

    // 检查空间是否存在
    const spaceId = body.spaceId
    if (!spaceId) {
      return NextResponse.json({
        error: 'No spaceId provided',
        body: body
      })
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!space) {
      return NextResponse.json({
        error: 'Space not found',
        spaceId: spaceId
      })
    }

    // 检查权限
    const hasPermission = space.ownerId === session.user.id

    return NextResponse.json({
      success: true,
      debug: {
        sessionUserId: session.user.id,
        spaceOwnerId: space.ownerId,
        hasPermission: hasPermission,
        space: {
          id: space.id,
          title: space.title,
          owner: space.owner
        },
        blocksCount: body.blocks?.length || 0,
        blocks: body.blocks?.map((block: any) => ({
          id: block.id,
          type: block.type,
          order: block.order,
          contentType: typeof block.content,
          aiTagsType: typeof block.aiTags,
          aiTags: block.aiTags
        }))
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
