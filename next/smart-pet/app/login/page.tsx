'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // 前端验证
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

    try {
      // 调用登录 API
      const response = await fetch('/api/auth/login', {
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
        throw new Error(data.error || '登录失败')
      }

      // 登录成功，双 token 已经通过 cookie 设置
      // 跳转到仪表板
      router.push('/dashboard')

    } catch (err) {
      console.error('登录错误:', err)
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试')
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
        </div>

        {/* 错误消息 */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-full px-6 py-3 mb-6">
            <p className="text-red-100 text-sm text-center">{error}</p>
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          {/* 登录按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  登录中...
                </>
              ) : (
                '立即登录'
              )}
            </button>
          </div>
        </form>

        {/* 底部链接 */}
        <div className="text-center mt-8">
          <div className="text-white/80 text-sm">
            <Link href="/forgot-password" className="hover:text-white transition-colors">
              忘记密码？
            </Link>
            <span className="mx-2">|</span>
            <Link href="/register" className="hover:text-white transition-colors">
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;