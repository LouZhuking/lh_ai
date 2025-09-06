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
          </div>

          <div className="text-sm text-muted-foreground">
            <p>如果遇到JWT错误，请点击"清除会话数据"按钮</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
