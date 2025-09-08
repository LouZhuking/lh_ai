'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function DebugSpacePage() {
  const { data: session } = useSession()
  const [spaceId, setSpaceId] = useState('')
  const [debugResult, setDebugResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testSpaceSave = async () => {
    if (!spaceId.trim()) {
      alert('请输入空间ID')
      return
    }

    setIsLoading(true)
    try {
      // 创建测试数据
      const testData = {
        spaceId: spaceId.trim(),
        blocks: [
          {
            id: 'test-block-1',
            type: 'paragraph',
            content: { text: '测试内容' },
            order: 0,
            aiTags: ['test', 'debug'],
            isPublic: false
          },
          {
            id: 'test-block-2',
            type: 'heading',
            content: { text: '测试标题', level: 1 },
            order: 1,
            aiTags: 'test,heading',
            isPublic: true
          }
        ]
      }

      // 调用调试API
      const response = await fetch('/api/debug/space-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      const result = await response.json()
      setDebugResult(result)

      // 如果调试通过，尝试实际保存
      if (result.success && result.debug.hasPermission) {
        console.log('调试通过，尝试实际保存...')

        const saveResponse = await fetch(`/api/spaces/${spaceId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blocks: testData.blocks })
        })

        const saveResult = await saveResponse.json()
        setDebugResult(prev => ({
          ...prev,
          actualSave: {
            success: saveResponse.ok,
            status: saveResponse.status,
            result: saveResult
          }
        }))
      }

    } catch (error) {
      setDebugResult({
        error: 'Request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTestSpace = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '测试空间 - ' + new Date().toLocaleString(),
          description: '用于调试的测试空间',
          isPublic: false
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSpaceId(result.id)
        alert(`测试空间创建成功！ID: ${result.id}`)
      } else {
        alert(`创建失败: ${result.error}`)
      }
    } catch (error) {
      alert(`创建失败: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>空间保存调试工具</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p><strong>当前用户:</strong> {session?.user?.email || '未登录'}</p>
              <p><strong>用户ID:</strong> {session?.user?.id || '无'}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">空间ID:</label>
              <Input
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                placeholder="输入要测试的空间ID"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={createTestSpace}
                disabled={isLoading || !session?.user}
                variant="outline"
              >
                创建测试空间
              </Button>

              <Button
                onClick={testSpaceSave}
                disabled={isLoading || !spaceId.trim()}
              >
                {isLoading ? '测试中...' : '测试保存功能'}
              </Button>
            </div>

            {debugResult && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">调试结果:</h3>
                <Textarea
                  value={JSON.stringify(debugResult, null, 2)}
                  readOnly
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
