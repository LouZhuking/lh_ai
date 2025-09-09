'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 自动跳转到登录页面
    router.push('/login')
  }, [router])

  // 在跳转过程中显示的加载页面
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Welcome 标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-white mb-8">Smart Pet</h1>
          <p className="text-white/80 text-lg mb-8">欢迎来到智能宠物管理系统</p>
        </div>

        {/* 加载提示 */}
        <div className="mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">正在跳转到登录页面...</p>
        </div>

        {/* 手动导航链接 */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            立即登录
          </Link>
          <Link
            href="/register"
            className="block w-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-medium py-4 px-6 rounded-full transition-colors duration-200"
          >
            立即注册
          </Link>
        </div>
      </div>
    </div>
  )
}
