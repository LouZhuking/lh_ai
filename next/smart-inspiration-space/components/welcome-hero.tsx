'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Brain,
  Zap,
  Users,
  Smartphone,
  ArrowRight,
  Check
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: '思维结构化',
    description: '以"块"为单位自由组织内容，建立双向关联，让思维更加清晰。'
  },
  {
    icon: Zap,
    title: 'AI 增强',
    description: '利用AI为内容打标签、摘要、翻译，发现你笔记中的深层联系。'
  },
  {
    icon: Users,
    title: '灵感社交',
    description: '发现和关注其他用户的公开空间，从别人的知识结构中获取灵感。'
  },
  {
    icon: Smartphone,
    title: '移动优先',
    description: '专为移动端优化，支持离线编辑和同步，随时随地记录灵感。'
  }
]

const benefits = [
  '无限嵌套的块编辑器',
  '智能双向链接系统',
  'AI 驱动的内容建议',
  '实时协作与分享',
  '离线优先的设计',
  '丰富的媒体支持'
]

export function WelcomeHero() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                智能灵感空间
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                融合块编辑、结构化思维与社区发现的
                <br />
                个人知识管理平台
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  开始使用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                  观看演示
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              为什么选择智能灵感空间？
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              结合当前最先进的知识管理理念，让你的思维更加高效
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                强大的功能，简洁的体验
              </h2>
              <p className="text-lg text-muted-foreground">
                智能灵感空间将复杂的知识管理工具变得简单易用，
                让你专注于创作和思考，而不是工具本身。
              </p>

              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/signup">
                <Button size="lg" className="mt-6">
                  立即注册
                </Button>
              </Link>
            </div>

            <div className="lg:order-first">
              <div className="relative">
                <div className="glass-effect rounded-2xl p-8 space-y-4">
                  <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <div className="h-3 bg-primary/30 rounded w-4/5"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-blue-500/20 rounded px-2 w-16"></div>
                    <div className="h-6 bg-green-500/20 rounded px-2 w-12"></div>
                    <div className="h-6 bg-purple-500/20 rounded px-2 w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              开始你的智能知识管理之旅
            </h2>
            <p className="text-xl opacity-90">
              加入thousands of用户，体验下一代知识管理工具
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  免费注册
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  已有账号？登录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
