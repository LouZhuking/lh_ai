'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Plus,
  FileText,
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface DashboardProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    bio: string | null
    spaces: Array<{
      id: string
      title: string
      description: string | null
      updatedAt: Date
      _count: {
        blocks: number
      }
    }>
    posts: Array<{
      id: string
      title: string
      excerpt: string | null
      updatedAt: Date
      _count: {
        likes: number
        comments: number
      }
    }>
    _count: {
      spaces: number
      posts: number
      following: number
      followers: number
    }
  }
}

export function DashboardContent({ user }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              欢迎回来, {user.name || '用户'}!
            </h1>
            <p className="text-muted-foreground">
              继续创作你的知识和想法
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link href="/space/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建空间
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              上传文件
            </Button>
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">我的空间</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.spaces}</div>
            <p className="text-xs text-muted-foreground">
              知识管理空间
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">发布文章</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.posts}</div>
            <p className="text-xs text-muted-foreground">
              公开发布的文章
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">关注中</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.following}</div>
            <p className="text-xs text-muted-foreground">
              你关注的用户
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">粉丝</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.followers}</div>
            <p className="text-xs text-muted-foreground">
              关注你的用户
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近空间和文章 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 最近的空间 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近的空间</CardTitle>
              <Link href="/spaces">
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.spaces.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>还没有创建空间</p>
                <Link href="/space/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    创建第一个空间
                  </Button>
                </Link>
              </div>
            ) : (
              user.spaces.map((space) => (
                <div key={space.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <Link href={`/space/${space.id}`} className="hover:underline">
                      <h3 className="font-medium">{space.title}</h3>
                    </Link>
                    {space.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {space.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>{space._count.blocks} 个块</span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatRelativeTime(space.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* 最近的文章 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近的文章</CardTitle>
              <Link href="/posts">
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>还没有发布文章</p>
                <Link href="/post/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    写第一篇文章
                  </Button>
                </Link>
              </div>
            ) : (
              user.posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <Link href={`/post/${post.id}`} className="hover:underline">
                      <h3 className="font-medium">{post.title}</h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Heart className="mr-1 h-3 w-3" />
                        {post._count.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="mr-1 h-3 w-3" />
                        {post._count.comments}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatRelativeTime(post.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
