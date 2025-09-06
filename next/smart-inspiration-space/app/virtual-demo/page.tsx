'use client'

import { useState, useEffect } from 'react'
import { VirtualList } from '@/components/virtual-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { RotateCcw, Database } from 'lucide-react'

// 模拟数据生成
const generateMockData = (start: number, count: number) => {
  const categories = ['技术', '设计', '产品', '管理', '创业', '生活', '学习', '思考']
  const authors = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']

  return Array.from({ length: count }, (_, i) => ({
    id: `item-${start + i}`,
    title: `文章标题 ${start + i + 1}: 这是一个很长的标题用来测试文本截断效果和虚拟列表的性能`,
    excerpt: `这是文章 ${start + i + 1} 的摘要内容。在这里我们会详细介绍这篇文章的主要内容和观点，让读者能够快速了解文章的核心价值。这个摘要相对较长，用来测试虚拟列表对于不同长度内容的处理能力。`,
    author: authors[Math.floor(Math.random() * authors.length)],
    readingTime: Math.floor(Math.random() * 20) + 1,
    tags: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () =>
      categories[Math.floor(Math.random() * categories.length)]
    ).filter((tag, index, arr) => arr.indexOf(tag) === index),
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    url: `https://example.com/article/${start + i + 1}`
  }))
}

export default function VirtualDemoPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const { toast } = useToast()

  const ITEMS_PER_PAGE = 50

  // 初始加载
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = () => {
    setLoading(true)
    // 模拟网络延迟
    setTimeout(() => {
      const initialData = generateMockData(0, ITEMS_PER_PAGE)
      setItems(initialData)
      setPage(1)
      setLoading(false)
      setHasMore(true)
      toast({
        title: "数据加载完成",
        description: `已加载 ${ITEMS_PER_PAGE} 条数据`
      })
    }, 1000)
  }

  const loadMore = () => {
    if (loading || !hasMore) return

    setLoading(true)
    // 模拟网络延迟
    setTimeout(() => {
      const newData = generateMockData(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE)
      setItems(prev => [...prev, ...newData])
      setPage(prev => prev + 1)
      setLoading(false)

      // 模拟数据有限，最多加载10页
      if (page >= 9) {
        setHasMore(false)
        toast({
          title: "已加载全部数据",
          description: `总共 ${page + 1} 页，${(page + 1) * ITEMS_PER_PAGE} 条数据`
        })
      } else {
        toast({
          title: "加载更多成功",
          description: `已加载第 ${page + 1} 页数据`
        })
      }
    }, 800)
  }

  const reset = () => {
    setItems([])
    setPage(0)
    setHasMore(true)
    setLoading(false)
    loadInitialData()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">虚拟列表演示</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            这是一个虚拟列表的演示页面，支持高性能渲染大量数据、懒加载、无限滚动等功能。
            虚拟列表只渲染可见区域的内容，大大提升了性能。
          </p>
        </div>

        {/* 统计信息 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已加载数据</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                总共 {page} 页数据
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">加载状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant={loading ? "default" : "secondary"}>
                  {loading ? "加载中" : "就绪"}
                </Badge>
                <Badge variant={hasMore ? "outline" : "destructive"}>
                  {hasMore ? "有更多" : "已全部加载"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">操作</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={reset} variant="outline" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                重置数据
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 虚拟列表 */}
        <Card>
          <CardHeader>
            <CardTitle>文章列表 (虚拟滚动)</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length > 0 ? (
              <VirtualList
                items={items}
                itemHeight={200}
                containerHeight={600}
                onLoadMore={loadMore}
                loading={loading}
                hasMore={hasMore}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {loading ? "正在加载数据..." : "暂无数据"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 说明 */}
        <Card>
          <CardHeader>
            <CardTitle>功能说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">虚拟滚动</h4>
                <p className="text-sm text-muted-foreground">
                  只渲染可见区域的内容，支持大量数据的高性能展示。无论有多少条数据，DOM 节点数量始终保持在合理范围内。
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">无限滚动</h4>
                <p className="text-sm text-muted-foreground">
                  滚动到底部时自动加载更多数据，提供流畅的用户体验。支持加载状态显示和错误处理。
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">预渲染优化</h4>
                <p className="text-sm text-muted-foreground">
                  在可见区域前后预渲染一定数量的元素，减少快速滚动时的白屏现象。
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">滚动指示器</h4>
                <p className="text-sm text-muted-foreground">
                  滚动时显示当前位置百分比，帮助用户了解浏览进度。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
