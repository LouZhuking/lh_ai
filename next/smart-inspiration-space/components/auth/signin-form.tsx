'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Chrome, Github } from 'lucide-react'
import Link from 'next/link'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "登录失败",
          description: "邮箱或密码错误",
          variant: "destructive"
        })
      } else {
        toast({
          title: "登录成功",
          description: "正在跳转..."
        })
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "登录失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error('OAuth sign in error:', error)
      toast({
        title: "登录失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">登录</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* OAuth 登录 */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            className="w-full"
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            使用 Google 登录
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            className="w-full"
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            使用 GitHub 登录
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或使用邮箱登录
            </span>
          </div>
        </div>

        {/* 演示账户信息 */}
        <div className="bg-muted p-3 rounded-lg text-sm">
          <p className="font-medium">演示账户：</p>
          <p>邮箱：demo@example.com</p>
          <p>密码：Demo123456</p>
          <p className="text-xs text-muted-foreground mt-1">
            或者您可以注册新账户
          </p>
        </div>

        {/* 凭证登录表单 */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱地址"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">还没有账户？</span>
          <Link href="/auth/signup" className="text-primary hover:underline ml-1">
            立即注册
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
