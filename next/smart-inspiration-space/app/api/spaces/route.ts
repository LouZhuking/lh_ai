import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSpaceSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([])
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createSpaceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { title, description, isPublic, tags } = validation.data

    // 创建空间
    const space = await prisma.space.create({
      data: {
        title,
        description,
        isPublic,
        ownerId: session.user.id,
        content: JSON.stringify({
          version: '1.0',
          blocks: []
        })
      }
    })

    // 处理标签
    if (tags.length > 0) {
      const tagPromises = tags.map(async (tagName) => {
        // 查找或创建标签
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })

        // 关联标签到空间
        return prisma.spaceTag.create({
          data: {
            spaceId: space.id,
            tagId: tag.id
          }
        })
      })

      await Promise.all(tagPromises)
    }

    // 创建默认块
    await prisma.block.create({
      data: {
        type: 'paragraph',
        content: JSON.stringify({ text: '' }),
        order: 0,
        spaceId: space.id
      }
    })

    return NextResponse.json(space, { status: 201 })
  } catch (error) {
    console.error('Create space error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const query = searchParams.get('q') || ''
    const isPublic = searchParams.get('public') === 'true'
    const userId = searchParams.get('userId')

    const skip = (page - 1) * limit

    const where: any = {}

    // 如果指定了用户ID，返回该用户的空间
    if (userId) {
      where.ownerId = userId
      // 如果不是当前用户，只返回公开的空间
      if (session?.user?.id !== userId) {
        where.isPublic = true
      }
    } else if (isPublic) {
      // 只返回公开空间
      where.isPublic = true
    } else if (session?.user?.id) {
      // 返回当前用户的空间
      where.ownerId = session.user.id
    } else {
      // 未登录用户只能看到公开空间
      where.isPublic = true
    }

    // 搜索功能
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } }
      ]
    }

    const [spaces, total] = await Promise.all([
      prisma.space.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              blocks: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.space.count({ where })
    ])

    const formattedSpaces = spaces.map(space => ({
      ...space,
      tags: space.tags.map(st => st.tag),
      blockCount: space._count.blocks
    }))

    return NextResponse.json({
      spaces: formattedSpaces,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get spaces error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
