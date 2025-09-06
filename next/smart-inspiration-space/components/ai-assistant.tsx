'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Sparkles,
  FileText,
  Expand,
  Tag,
  PenTool,
  Languages,
  Link as LinkIcon,
  Loader2,
  LucideIcon
} from 'lucide-react'

interface AIAssistantProps {
  content?: string
  onResult?: (result: string | string[], action: string) => void
  className?: string
}

interface AIAction {
  key: string
  label: string
  icon: LucideIcon
  description: string
}

const aiActions: AIAction[] = [
  {
    key: 'summarize',
    label: '生成摘要',
    icon: FileText,
    description: '为内容生成简洁摘要'
  },
  {
    key: 'expand',
    label: '扩写内容',
    icon: Expand,
    description: '扩展和丰富内容'
  },
  {
    key: 'generate_tags',
    label: '生成标签',
    icon: Tag,
    description: '自动生成相关标签'
  },
  {
    key: 'improve',
    label: '改善表达',
    icon: PenTool,
    description: '改善语言表达'
  },
  {
    key: 'translate',
    label: '翻译',
    icon: Languages,
    description: '翻译到其他语言'
  },
  {
    key: 'find_related',
    label: '发现关联',
    icon: LinkIcon,
    description: '找出相关概念'
  }
]

export function AIAssistant({ content = '', onResult, className }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<string>('')
  const [inputContent, setInputContent] = useState(content)
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | string[] | null>(null)
  const { toast } = useToast()

  const handleAction = async (actionKey: string) => {
    if (!inputContent.trim()) {
      toast({
        title: "内容不能为空",
        description: "请输入要处理的内容",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setCurrentAction(actionKey)
    setIsOpen(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: actionKey,
          content: inputContent,
          options
        }),
      })

      if (!response.ok) {
        throw new Error('AI request failed')
      }

      const data = await response.json()
      setResult(data.result)
      onResult?.(data.result, actionKey)

      toast({
        title: "处理完成",
        description: `${aiActions.find(a => a.key === actionKey)?.label}已完成`
      })
    } catch (error) {
      console.error('AI error:', error)
      toast({
        title: "处理失败",
        description: "AI服务暂时不可用，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeDialog = () => {
    setIsOpen(false)
    setResult(null)
    setCurrentAction('')
    setOptions({})
  }

  const renderResult = () => {
    if (!result) return null

    const action = aiActions.find(a => a.key === currentAction)

    if (currentAction === 'generate_tags' || currentAction === 'find_related') {
      return (
        <div className="space-y-2">
          <Label>{action?.label}结果：</Label>
          <div className="flex flex-wrap gap-2">
            {(result as string[]).map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label>{action?.label}结果：</Label>
        <Textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          rows={6}
          className="resize-none"
        />
      </div>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI 助手
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2 text-sm text-muted-foreground">
            AI 增强功能
          </div>
          <DropdownMenuSeparator />
          {aiActions.map((action) => {
            const Icon = action.icon
            return (
              <DropdownMenuItem
                key={action.key}
                onClick={() => handleAction(action.key)}
                className="flex flex-col items-start gap-1 p-3"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{action.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {(() => {
                const action = aiActions.find(a => a.key === currentAction)
                if (!action) return null
                const Icon = action.icon
                return (
                  <>
                    <Icon className="h-5 w-5" />
                    {action.label}
                  </>
                )
              })()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 输入内容 */}
            <div className="space-y-2">
              <Label>内容：</Label>
              <Textarea
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="输入要处理的内容..."
                rows={4}
              />
            </div>

            {/* 特定选项 */}
            {currentAction === 'expand' && (
              <div className="space-y-2">
                <Label>写作风格（可选）：</Label>
                <Input
                  value={options.style || ''}
                  onChange={(e) => setOptions({ ...options, style: e.target.value })}
                  placeholder="例如：正式、幽默、学术..."
                />
              </div>
            )}

            {currentAction === 'translate' && (
              <div className="space-y-2">
                <Label>目标语言：</Label>
                <Input
                  value={options.targetLang || '英文'}
                  onChange={(e) => setOptions({ ...options, targetLang: e.target.value })}
                  placeholder="例如：英文、日文、法文..."
                />
              </div>
            )}

            {currentAction === 'improve' && (
              <div className="space-y-2">
                <Label>改善要求（可选）：</Label>
                <Input
                  value={options.instruction || ''}
                  onChange={(e) => setOptions({ ...options, instruction: e.target.value })}
                  placeholder="例如：使语言更简洁、增加专业性..."
                />
              </div>
            )}

            {/* 处理结果 */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">AI正在处理中...</span>
              </div>
            ) : (
              renderResult()
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeDialog}>
                关闭
              </Button>
              {!isLoading && (
                <Button onClick={() => handleAction(currentAction)}>
                  重新处理
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
