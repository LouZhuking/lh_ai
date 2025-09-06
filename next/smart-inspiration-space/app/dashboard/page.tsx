import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { DashboardContent } from '@/components/dashboard-content'
import { redirect } from 'next/navigation'

async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        spaces: {
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: {
              select: {
                blocks: true
              }
            }
          }
        },
        posts: {
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          }
        },
        _count: {
          select: {
            spaces: true,
            posts: true,
            following: true,
            followers: true
          }
        }
      }
    })

    return user
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export default async function DashboardPage() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')

  if (!userId) {
    redirect('/auth/signin-jwt')
  }

  const userData = await getUserData(userId)

  if (!userData) {
    redirect('/auth/signin-jwt')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardContent user={userData} />
    </div>
  )
}
