import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WelcomeHero } from '@/components/welcome-hero'
import { DiscoverFeed } from '@/components/discover-feed'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // 如果未登录，显示欢迎页面
  if (!session) {
    return <WelcomeHero />
  }

  // 已登录用户显示发现页面
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            欢迎回来, {session.user?.name}!
          </h1>
          <p className="text-muted-foreground">
            发现新的灵感，连接你的想法
          </p>
        </div>

        <DiscoverFeed />
      </div>
    </div>
  )
}