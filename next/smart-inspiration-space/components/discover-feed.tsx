'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Sparkles
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

// 模拟数据
const mockPosts = [
  {
    id: '1',
    title: '关于产品设计的思考',
    content: '最近在思考用户体验设计的本质。好的设计不是让界面变得漂亮，而是让用户完成任务时感到愉悦和高效。每一个交互细节都应该为用户服务，而不是为了展示设计师的技巧。',
    author: {
      name: '设计师小王',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      id: 'designer-wang'
    },
    tags: ['设计', 'UX', '产品'],
    likes: 24,
    comments: 5,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
  },
  {
    id: '2',
    title: 'React 19 新特性学习笔记',
    content: 'React 19 带来了很多令人兴奋的新特性：\n\n- **React Compiler**: 自动优化组件性能\n- **Actions**: 简化表单处理和数据更新\n- **use() Hook**: 更好的异步数据处理\n\n这些特性将大大提升开发体验和应用性能。',
    author: {
      name: '前端开发者',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      id: 'frontend-dev'
    },
    tags: ['React', '前端', '技术'],
    likes: 42,
    comments: 12,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4小时前
  },
  {
    id: '3',
    title: '冥想练习的收获',
    content: '坚持冥想已经3个月了，感觉到明显的变化：注意力更集中，情绪更稳定，对待困难的心态也更加平和。推荐大家尝试每天10分钟的正念冥想。',
    author: {
      name: '瑜伽老师',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face',
      id: 'yoga-teacher'
    },
    tags: ['冥想', '正念', '生活'],
    likes: 18,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
  }
]

export function DiscoverFeed() {
  const [posts, setPosts] = useState(mockPosts)

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
        : post
    ))
  }

  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">发现精彩内容</h2>
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          AI 推荐
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={post.isLiked ? 'text-red-500' : ''}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>

                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {post.comments}
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Share className="mr-1 h-4 w-4" />
                    分享
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(post.id)}
                  className={post.isBookmarked ? 'text-yellow-500' : ''}
                >
                  <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="w-full">
          加载更多内容
        </Button>
      </div>
    </div>
  )
}
