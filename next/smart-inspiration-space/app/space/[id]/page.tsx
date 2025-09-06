import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SpaceEditor } from '@/components/space-editor'

interface SpacePageProps {
  params: {
    id: string
  }
}

async function getSpace(id: string, userId?: string) {
  const space = await prisma.space.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
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
    return null
  }

  // 检查访问权限
  if (!space.isPublic && space.ownerId !== userId) {
    return null
  }

  return {
    ...space,
    tags: space.tags.map(st => st.tag)
  }
}

export default async function SpacePage({ params }: SpacePageProps) {
  const session = await getServerSession(authOptions)
  const space = await getSpace(params.id, session?.user?.id)

  if (!space) {
    notFound()
  }

  const isOwner = session?.user?.id === space.ownerId
  const canEdit = isOwner

  return (
    <div className="container mx-auto px-4 py-8">
      <SpaceEditor
        space={space}
        canEdit={canEdit}
        isOwner={isOwner}
      />
    </div>
  )
}
