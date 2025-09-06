'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { emailRegex, passwordRegex } from '@/lib/regexp'

export function JwtSignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 表单验证状态
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // 实时验证邮箱
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailValid(emailRegex.test(value))
  }

  // 实时验证密码
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setPasswordValid(value.length >= 6) // 登录时不需要严格的密码验证，只检查长度
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "登录成功",
          description: "正在跳转到首页..."
        })
        router.push('/dashboard')
        router.refresh()
      } else {
        toast({
          title: "登录失败",
          description: data.error || "登录过程中出现错误",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "登录失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">JWT 登录</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 演示账户提示 */}
        <div className="bg-muted p-3 rounded-lg text-sm">
          <p className="font-medium">演示账户：</p>
          <p>邮箱：demo@example.com</p>
          <p>密码：Demo123456</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="输入邮箱地址"
                required
                className={email ? (emailValid ? 'border-green-500' : 'border-red-500') : ''}
              />
              {email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="输入密码"
                required
                className={password ? (passwordValid ? 'border-green-500' : 'border-red-500') : ''}
              />
              <div className="absolute right-0 top-0 h-full flex items-center">
                {password && (
                  <div className="px-2">
                    {passwordValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '登录中...' : 'JWT 登录'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或使用其他方式
            </span>
          </div>
        </div>

        <div className="text-center text-sm">
          <Link href="/auth/signin" className="text-primary hover:underline">
            使用 NextAuth 登录
          </Link>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">还没有账户？</span>
          <Link href="/auth/register-jwt" className="text-primary hover:underline ml-1">
            立即注册
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
