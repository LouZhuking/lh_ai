'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/utils'
import { Eye, Heart, MessageCircle, ExternalLink } from 'lucide-react'

interface VirtualListItem {
  id: string
  title: string
  excerpt?: string
  author?: string
  readingTime?: number
  tags?: string[]
  views?: number
  likes?: number
  comments?: number
  publishedAt?: Date
  url?: string
}

interface VirtualListProps {
  items: VirtualListItem[]
  itemHeight?: number
  containerHeight?: number
  onLoadMore?: () => void
  loading?: boolean
  hasMore?: boolean
}

export function VirtualList({
  items,
  itemHeight = 200,
  containerHeight = 600,
  onLoadMore,
  loading = false,
  hasMore = true
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 计算可见区域的项目
  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )

    return {
      start: Math.max(0, visibleStart - 5), // 预渲染前面5个
      end: Math.min(items.length, visibleEnd + 5) // 预渲染后面5个
    }
  }, [scrollTop, itemHeight, containerHeight, items.length])

  // 可见的项目
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      index: visibleRange.start + index
    }))
  }, [items, visibleRange])

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
    setIsScrolling(true)

    // 清除之前的超时
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // 设置新的超时
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)

    // 检查是否需要加载更多
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollHeight - scrollTop <= clientHeight + 200 && hasMore && !loading && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, loading, onLoadMore])

  // 清理副作用
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // 渲染单个项目
  const renderItem = useCallback((item: VirtualListItem & { index: number }) => (
    <div
      key={item.id}
      className="absolute w-full"
      style={{
        top: item.index * itemHeight,
        height: itemHeight,
      }}
    >
      <Card className="mx-2 my-2 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* 标题和作者 */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary cursor-pointer">
                {item.title}
              </h3>
              {item.author && (
                <p className="text-sm text-muted-foreground mt-1">
                  by {item.author}
                  {item.publishedAt && (
                    <span> • {formatRelativeTime(item.publishedAt)}</span>
                  )}
                  {item.readingTime && (
                    <span> • {item.readingTime} min read</span>
                  )}
                </p>
              )}
            </div>

            {/* 摘要 */}
            {item.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.excerpt}
              </p>
            )}

            {/* 标签 */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 统计信息和操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {typeof item.views === 'number' && (
                  <span className="flex items-center">
                    <Eye className="mr-1 h-3 w-3" />
                    {item.views}
                  </span>
                )}
                {typeof item.likes === 'number' && (
                  <span className="flex items-center">
                    <Heart className="mr-1 h-3 w-3" />
                    {item.likes}
                  </span>
                )}
                {typeof item.comments === 'number' && (
                  <span className="flex items-center">
                    <MessageCircle className="mr-1 h-3 w-3" />
                    {item.comments}
                  </span>
                )}
              </div>

              {item.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ), [itemHeight])

  // 加载骨架屏
  const renderSkeleton = useCallback(() => (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="mx-2">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ), [])

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative overflow-auto border rounded-lg"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* 虚拟容器 */}
        <div
          style={{
            height: items.length * itemHeight,
            position: 'relative'
          }}
        >
          {visibleItems.map(renderItem)}
        </div>
      </div>

      {/* 加载更多 */}
      {loading && renderSkeleton()}

      {!loading && hasMore && items.length > 0 && (
        <div className="text-center py-4">
          <Button onClick={onLoadMore} variant="outline">
            加载更多
          </Button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          没有更多内容了
        </div>
      )}

      {/* 滚动指示器 */}
      {isScrolling && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded text-sm">
          {Math.round((scrollTop / (items.length * itemHeight - containerHeight)) * 100)}%
        </div>
      )}
    </div>
  )
}
