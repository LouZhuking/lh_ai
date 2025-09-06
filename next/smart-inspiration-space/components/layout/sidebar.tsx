'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Home,
  Search,
  Plus,
  Folder,
  Star,
  Users,
  Settings,
  BookOpen,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
  {
    title: '发现',
    href: '/discover',
    icon: Search,
  },
  {
    title: '我的空间',
    href: '/spaces',
    icon: Folder,
  },
  {
    title: '收藏',
    href: '/favorites',
    icon: Star,
  },
  {
    title: '关注',
    href: '/following',
    icon: Users,
  },
]

const quickActions = [
  {
    title: '新建空间',
    href: '/space/new',
    icon: Plus,
  },
  {
    title: '文件上传',
    href: '/upload',
    icon: BookOpen,
  },
  {
    title: 'AI 助手',
    href: '/ai-assistant',
    icon: Lightbulb,
  },
]

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) {
    return null
  }

  return (
    <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block hidden">
      <ScrollArea className="h-full px-4 py-6">
        <div className="space-y-6">
          {/* 主导航 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              导航
            </h3>
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-secondary"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 快速操作 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              快速操作
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => {
                const Icon = action.icon

                return (
                  <Link key={action.href} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {action.title}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 最近空间 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              最近空间
            </h3>
            <div className="space-y-1">
              {/* TODO: 从API加载最近的空间 */}
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Folder className="mr-2 h-4 w-4" />
                我的学习笔记
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Folder className="mr-2 h-4 w-4" />
                工作记录
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Folder className="mr-2 h-4 w-4" />
                灵感收集
              </Button>
            </div>
          </div>

          {/* 标签 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              标签
            </h3>
            <div className="flex flex-wrap gap-1">
              {/* TODO: 从API加载用户的标签 */}
              <Button variant="outline" size="sm" className="h-6 text-xs">
                技术
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                学习
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                灵感
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                工作
              </Button>
            </div>
          </div>

          {/* 设置 */}
          <div className="pt-4 border-t">
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                设置
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
