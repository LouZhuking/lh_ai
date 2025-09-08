'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TestAuthPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClearing, setIsClearing] = useState(false)
  const [isForceResetting, setIsForceResetting] = useState(false)
  const [envStatus, setEnvStatus] = useState<any>(null)

  const clearSession = async () => {
    setIsClearing(true)
    try {
      // 调用清除会话API
      await fetch('/api/auth/clear-session', { method: 'POST' })

      // 强制登出
      await signOut({ redirect: false })

      // 清除本地存储
      localStorage.clear()
      sessionStorage.clear()

      // 重定向到登录页
      router.push('/auth/signin')
    } catch (error) {
      console.error('清除会话失败:', error)
    } finally {
      setIsClearing(false)
    }
  }

  const forceReset = async () => {
    setIsForceResetting(true)
    try {
      // 强制重置所有会话数据
      const response = await fetch('/api/auth/force-reset', { method: 'POST' })
      const result = await response.json()

      console.log('强制重置结果:', result)

      // 清除本地存储
      localStorage.clear()
      sessionStorage.clear()

      // 强制刷新页面
      window.location.href = '/auth/signin'
    } catch (error) {
      console.error('强制重置失败:', error)
    } finally {
      setIsForceResetting(false)
    }
  }

  const checkEnv = async () => {
    try {
      const response = await fetch('/api/debug/env-check')
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error('检查环境变量失败:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>认证状态测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>状态:</strong> {status}</p>
            {session ? (
              <div className="mt-2">
                <p><strong>用户ID:</strong> {session.user?.id}</p>
                <p><strong>邮箱:</strong> {session.user?.email}</p>
                <p><strong>姓名:</strong> {session.user?.name}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">未登录</p>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => router.push('/auth/signin')}
              className="w-full"
            >
              前往登录
            </Button>

            <Button
              onClick={() => router.push('/auth/signup')}
              variant="outline"
              className="w-full"
            >
              前往注册
            </Button>

            <Button
              onClick={clearSession}
              variant="destructive"
              className="w-full"
              disabled={isClearing}
            >
              {isClearing ? '清除中...' : '清除会话数据'}
            </Button>

            <Button
              onClick={forceReset}
              variant="destructive"
              className="w-full"
              disabled={isForceResetting}
            >
              {isForceResetting ? '强制重置中...' : '🔥 强制重置所有数据'}
            </Button>

            <Button
              onClick={checkEnv}
              variant="secondary"
              className="w-full"
            >
              检查环境变量
            </Button>
          </div>

          {envStatus && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">环境变量状态:</h4>
              <div className="text-sm space-y-1">
                <p>NEXTAUTH_SECRET: <span className={envStatus.NEXTAUTH_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>{envStatus.NEXTAUTH_SECRET}</span></p>
                <p>NEXTAUTH_URL: <span className="text-blue-600">{envStatus.NEXTAUTH_URL}</span></p>
                <p>NODE_ENV: <span className="text-blue-600">{envStatus.NODE_ENV}</span></p>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p><strong>JWT错误解决步骤：</strong></p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>点击"检查环境变量"</li>
              <li>点击"🔥 强制重置所有数据"</li>
              <li>重新访问应用</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
