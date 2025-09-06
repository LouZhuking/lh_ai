import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSpaceSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  blocks: z.array(z.object({
    id: z.string(),
    type: z.string(),
    content: z.any(),
    order: z.number(),
    aiTags: z.array(z.string()).optional(),
    isPublic: z.boolean().optional()
  })).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const space = await prisma.space.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        blocks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    // 检查访问权限
    if (!space.isPublic && space.ownerId !== session?.user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formattedSpace = {
      ...space,
      tags: space.tags.map(st => st.tag)
    }

    return NextResponse.json(formattedSpace)
  } catch (error) {
    console.error('Get space error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const space = await prisma.space.findUnique({
      where: { id: params.id }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    // 检查编辑权限
    if (space.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateSpaceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { blocks, ...spaceData } = validation.data

    // 使用事务更新空间和块
    const result = await prisma.$transaction(async (tx) => {
      // 更新空间信息
      const updatedSpace = await tx.space.update({
        where: { id: params.id },
        data: spaceData
      })

      // 如果提供了块数据，更新块
      if (blocks) {
        // 删除现有块
        await tx.block.deleteMany({
          where: { spaceId: params.id }
        })

        // 创建新块
        if (blocks.length > 0) {
          await tx.block.createMany({
            data: blocks.map(block => ({
              id: block.id,
              type: block.type,
              content: JSON.stringify(block.content),
              order: block.order,
              spaceId: params.id,
              aiTags: block.aiTags || [],
              isPublic: block.isPublic || false
            }))
          })
        }
      }

      return updatedSpace
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Update space error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const space = await prisma.space.findUnique({
      where: { id: params.id }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    // 检查删除权限
    if (space.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 删除空间（级联删除相关数据）
    await prisma.space.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete space error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
