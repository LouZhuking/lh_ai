'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, CheckCircle, XCircle, Chrome, Github } from 'lucide-react'
import Link from 'next/link'
import { emailRegex, passwordRegex } from '@/lib/regexp'
import { signIn } from 'next-auth/react'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 表单验证状态
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

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
    setPasswordValid(passwordRegex.test(value))
    setPasswordsMatch(value === confirmPassword && value.length > 0)
  }

  // 实时验证确认密码
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    setPasswordsMatch(value === password && value.length > 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 前端验证
    if (!emailValid) {
      toast({
        title: "邮箱格式错误",
        description: "请输入有效的邮箱地址",
        variant: "destructive"
      })
      return
    }

    if (!passwordValid) {
      toast({
        title: "密码格式错误",
        description: "密码至少8位，包含字母和数字",
        variant: "destructive"
      })
      return
    }

    if (!passwordsMatch) {
      toast({
        title: "密码不匹配",
        description: "请确认两次输入的密码相同",
        variant: "destructive"
      })
      return
    }

    if (name.length < 2 || name.length > 20) {
      toast({
        title: "用户名长度错误",
        description: "用户名长度应在2-20字符之间",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "注册成功",
          description: "正在为您登录..."
        })

        // 先清除可能存在的旧会话
        try {
          await fetch('/api/auth/clear-session', { method: 'POST' })
        } catch (e) {
          console.log('清除旧会话:', e)
        }

        // 注册成功后自动登录
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast({
            title: "登录失败",
            description: "注册成功，但自动登录失败，请手动登录",
            variant: "destructive"
          })
          router.push('/auth/signin')
        } else {
          toast({
            title: "登录成功",
            description: "欢迎使用智能灵感空间！"
          })
          router.push('/')
          router.refresh()
        }
      } else {
        toast({
          title: "注册失败",
          description: data.error || "注册过程中出现错误",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Register error:', error)
      toast({
        title: "注册失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/' })
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
        <CardTitle className="text-center">创建账户</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* OAuth 注册 */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            className="w-full"
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            使用 Google 注册
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            className="w-full"
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            使用 GitHub 注册
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或使用邮箱注册
            </span>
          </div>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">用户名</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入用户名"
              required
            />
          </div>

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
                placeholder="至少8位，包含字母和数字"
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
            {password && !passwordValid && (
              <p className="text-sm text-red-500">
                密码必须至少8位，包含字母和数字
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="再次输入密码"
                required
                className={confirmPassword ? (passwordsMatch ? 'border-green-500' : 'border-red-500') : ''}
              />
              <div className="absolute right-0 top-0 h-full flex items-center">
                {confirmPassword && (
                  <div className="px-2">
                    {passwordsMatch ? (
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500">
                两次输入的密码不一致
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !emailValid || !passwordValid || !passwordsMatch || name.length < 2}
          >
            {isLoading ? '注册中...' : '创建账户'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">已有账户？</span>
          <Link href="/auth/signin" className="text-primary hover:underline ml-1">
            立即登录
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
