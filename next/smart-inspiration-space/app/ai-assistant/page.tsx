import { AIChat } from '@/components/ai-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Search,
  FileText,
  BarChart3
} from 'lucide-react'

const Tool = BarChart3; // 临时修复：lucide-react 没有导出 Tool，使用 BarChart3 代替

const features = [
  {
    icon: Search,
    title: '知识库搜索',
    description: '在你的空间、文章、标签中快速搜索信息'
  },
  {
    icon: FileText,
    title: '智能笔记',
    description: '自动创建格式化的知识笔记和空间'
  },
  {
    icon: BarChart3,
    title: '写作分析',
    description: '分析文本的复杂度、可读性和写作风格'
  },
  {
    icon: Tool,
    title: '工具调用',
    description: '智能选择和执行适合的工具来完成任务'
  }
]

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* 页面头部 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI 智能助手</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            基于先进的AI技术，为你提供智能对话、知识管理、内容分析等功能。
            支持流式输出和工具调用，让AI更好地理解和帮助你。
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* AI聊天界面 */}
          <div className="lg:col-span-2">
            <AIChat
              title="智能助手"
              systemPrompt="你是智能灵感空间的AI助手。你可以帮助用户管理知识、搜索信息、分析内容、创建笔记等。当用户需要时，你会主动调用相应的工具来完成任务。请用友好、专业的语气与用户交流。"
              placeholder="问我任何关于知识管理、内容创作的问题..."
            />
          </div>

          {/* 功能介绍 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI 功能特性</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">使用技巧</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">搜索知识</Badge>
                  <p className="text-xs text-muted-foreground">
                    &quot;搜索关于React的空间&quot; 或 &quot;找找我写过的技术文章&quot;
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">创建笔记</Badge>
                  <p className="text-xs text-muted-foreground">
                    &quot;帮我创建一个关于AI学习的笔记空间&quot;
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">分析文本</Badge>
                  <p className="text-xs text-muted-foreground">
                    &quot;分析这段文字的写作风格&quot; 然后粘贴你的文本
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">流式对话</Badge>
                  <p className="text-xs text-muted-foreground">
                    支持实时流式输出，AI回答会逐字显示
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">技术特性</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>流式输出</span>
                  <Badge variant="secondary">支持</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Function Tool</span>
                  <Badge variant="secondary">支持</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>上下文记忆</span>
                  <Badge variant="secondary">支持</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>多模态输入</span>
                  <Badge variant="outline">计划中</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
