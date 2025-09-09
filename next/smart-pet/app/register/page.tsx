'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    // 前端验证
    if (!username.trim()) {
      setError('请输入用户名')
      setIsLoading(false)
      return
    }

    if (!email.trim()) {
      setError('请输入邮箱')
      setIsLoading(false)
      return
    }

    if (!password) {
      setError('请输入密码')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('密码不匹配')
      setIsLoading(false)
      return
    }

    if (password.length < 6 || password.length > 18) {
      setError('密码需6-18位')
      setIsLoading(false)
      return
    }

    // 检查密码是否全为数字
    if (/^\d+$/.test(password)) {
      setError('密码不能全为数字')
      setIsLoading(false)
      return
    }

    try {
      // 调用注册 API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      // 注册成功
      setSuccess('注册成功！正在为您自动登录...')

      // 注册成功后自动登录
      setTimeout(async () => {
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          })

          const loginData = await loginResponse.json()

          if (loginResponse.ok) {
            // 登录成功，跳转到仪表板
            router.push('/dashboard')
          } else {
            // 登录失败，跳转到登录页面
            setSuccess('注册成功！请手动登录')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          }
        } catch (loginError) {
          console.error('自动登录失败:', loginError)
          setSuccess('注册成功！请手动登录')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      }, 1500)

    } catch (err) {
      console.error('注册错误:', err)
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Welcome 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-white mb-2">Welcome</h1>
          <p className="text-white/80 text-lg">创建您的账户</p>
        </div>

        {/* 错误和成功消息 */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-full px-6 py-3 mb-6">
            <p className="text-red-100 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-full px-6 py-3 mb-6">
            <p className="text-green-100 text-sm text-center">{success}</p>
          </div>
        )}

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名输入框 */}
          <div>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          {/* 邮箱输入框 */}
          <div>
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          {/* 密码输入框 */}
          <div>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          {/* 确认密码输入框 */}
          <div>
            <input
              type="password"
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          {/* 注册按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  处理中...
                </>
              ) : (
                '立即注册'
              )}
            </button>
          </div>
        </form>

        {/* 底部链接 */}
        <div className="text-center mt-8">
          <div className="text-white/80 text-sm">
            已有账户？
            <Link href="/login" className="ml-2 hover:text-white transition-colors">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;