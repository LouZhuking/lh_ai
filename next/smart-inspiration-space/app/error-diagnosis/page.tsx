'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export default function ErrorDiagnosisPage() {
  const { data: session, status } = useSession()
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [manualTest, setManualTest] = useState('')

  const runComprehensiveCheck = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/debug/comprehensive-check')
      const data = await response.json()
      setDiagnosticResults(data)
    } catch (error) {
      setDiagnosticResults({
        error: 'Failed to run comprehensive check',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testSpaceCreation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '诊断测试空间 - ' + new Date().toLocaleString(),
          description: '用于错误诊断的测试空间',
          isPublic: false
        })
      })

      const result = await response.json()

      setManualTest(prev => prev + `\n=== 空间创建测试 ===\n` +
        `状态: ${response.status}\n` +
        `结果: ${JSON.stringify(result, null, 2)}\n`)
    } catch (error) {
      setManualTest(prev => prev + `\n空间创建测试失败: ${error}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSpaceUpdate = async () => {
    if (!diagnosticResults?.checks?.data_status?.spaceCount) {
      alert('请先创建一个测试空间')
      return
    }

    setIsLoading(true)
    try {
      // 获取第一个空间
      const spacesResponse = await fetch('/api/spaces')
      const spaces = await spacesResponse.json()

      if (!spaces.length) {
        throw new Error('没有找到空间')
      }

      const spaceId = spaces[0].id

      // 尝试更新空间
      const updateResponse = await fetch(`/api/spaces/${spaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              id: 'test-block-' + Date.now(),
              type: 'paragraph',
              content: { text: '诊断测试内容' },
              order: 0,
              aiTags: ['test', 'diagnosis'],
              isPublic: false
            }
          ]
        })
      })

      const updateResult = await updateResponse.json()

      setManualTest(prev => prev + `\n=== 空间更新测试 ===\n` +
        `空间ID: ${spaceId}\n` +
        `状态: ${updateResponse.status}\n` +
        `结果: ${JSON.stringify(updateResult, null, 2)}\n`)
    } catch (error) {
      setManualTest(prev => prev + `\n空间更新测试失败: ${error}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderCheckStatus = (check: any, name: string) => {
    if (check?.error) {
      return (
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="font-medium">{name}</span>
          <Badge variant="destructive">错误</Badge>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="font-medium">{name}</span>
        <Badge variant="default">正常</Badge>
      </div>
    )
  }

  useEffect(() => {
    runComprehensiveCheck()
  }, [])

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              系统错误诊断工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={runComprehensiveCheck}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? '检查中...' : '重新检查'}
              </Button>

              <Button
                onClick={testSpaceCreation}
                disabled={isLoading || !session}
                variant="outline"
              >
                测试空间创建
              </Button>

              <Button
                onClick={testSpaceUpdate}
                disabled={isLoading || !session}
                variant="outline"
              >
                测试空间保存
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">认证状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>登录状态:</strong> {status}</p>
                    <p><strong>用户邮箱:</strong> {session?.user?.email || '未登录'}</p>
                    <p><strong>用户ID:</strong> {session?.user?.id || '无'}</p>
                  </div>
                </CardContent>
              </Card>

              {diagnosticResults && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">系统检查结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {diagnosticResults.checks?.environment &&
                      renderCheckStatus(diagnosticResults.checks.environment, '环境变量')}
                    {diagnosticResults.checks?.database &&
                      renderCheckStatus(diagnosticResults.checks.database, '数据库连接')}
                    {diagnosticResults.checks?.authentication &&
                      renderCheckStatus(diagnosticResults.checks.authentication, '用户认证')}
                    {diagnosticResults.checks?.database_schema &&
                      renderCheckStatus(diagnosticResults.checks.database_schema, '数据库结构')}
                  </CardContent>
                </Card>
              )}
            </div>

            {diagnosticResults && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">详细诊断报告</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={JSON.stringify(diagnosticResults, null, 2)}
                    readOnly
                    rows={15}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            )}

            {manualTest && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">手动测试结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={manualTest}
                    readOnly
                    rows={10}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>常见问题解决方案</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">1. JWT会话错误</h3>
              <p className="text-sm text-muted-foreground mb-2">
                如果看到 "JWT_SESSION_ERROR" 或 "decryption operation failed"
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 访问 <code>/test-auth</code> 页面清除会话数据</li>
                <li>• 确保 NEXTAUTH_SECRET 环境变量已设置</li>
                <li>• 重启开发服务器</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">2. 空间保存失败</h3>
              <p className="text-sm text-muted-foreground mb-2">
                如果看到 "Failed to save" 错误
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 确保用户已登录</li>
                <li>• 检查用户是否为空间所有者</li>
                <li>• 验证数据格式是否正确</li>
                <li>• 查看浏览器控制台的详细错误信息</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">3. 注册失败</h3>
              <p className="text-sm text-muted-foreground mb-2">
                如果看到 "服务器内部错误" 或注册无响应
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 确保数据库连接正常</li>
                <li>• 检查 User 表是否有 password 字段</li>
                <li>• 验证邮箱格式和密码强度</li>
                <li>• 检查邮箱是否已被注册</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
