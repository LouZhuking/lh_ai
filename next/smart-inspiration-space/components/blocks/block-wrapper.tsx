'use client'

import { useState } from 'react'
import { Block } from '@/types/block'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  GripVertical,
  Plus,
  MoreHorizontal,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  Hash,
  CheckSquare,
  Code,
  Quote,
  Image,
  List,
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockWrapperProps {
  block: Block
  isActive?: boolean
  children: React.ReactNode
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAddBlock?: (position: 'before' | 'after', type?: string) => void
}

const blockTypes = [
  { type: 'paragraph', icon: Type, label: '段落' },
  { type: 'heading', icon: Hash, label: '标题' },
  { type: 'todo', icon: CheckSquare, label: '待办' },
  { type: 'code', icon: Code, label: '代码' },
  { type: 'quote', icon: Quote, label: '引用' },
  { type: 'image', icon: Image, label: '图片' },
  { type: 'list', icon: List, label: '列表' },
  { type: 'divider', icon: Minus, label: '分割线' },
]

export function BlockWrapper({
  block,
  isActive = false,
  children,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
}: BlockWrapperProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)

  return (
    <div className={cn(
      "block-item group relative",
      isActive && "ring-2 ring-primary/20"
    )}>
      {/* 拖拽手柄 */}
      <div className="block-handle">
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* 主要内容 */}
      <div className="pl-8 pr-8">
        {children}
      </div>

      {/* 操作菜单 */}
      <div className="block-menu flex items-center space-x-1">
        {/* 添加块菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2 text-sm text-muted-foreground">在下方插入</div>
            <DropdownMenuSeparator />
            {blockTypes.map((blockType) => {
              const Icon = blockType.icon
              return (
                <DropdownMenuItem
                  key={blockType.type}
                  onClick={() => onAddBlock?.('after', blockType.type)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {blockType.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 更多操作菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onMoveUp}>
              <ArrowUp className="mr-2 h-4 w-4" />
              上移
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveDown}>
              <ArrowDown className="mr-2 h-4 w-4" />
              下移
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
