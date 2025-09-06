'use client'

import { useState } from 'react'
import { SpaceData } from '@/types/block'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import {
  Edit3,
  Share,
  MoreHorizontal,
  Eye,
  EyeOff,
  Save,
  Clock,
  User,
  Heart,
  MessageCircle
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface SpaceHeaderProps {
  space: SpaceData
  canEdit?: boolean
  isOwner?: boolean
  isSaving?: boolean
  onUpdate?: (updates: Partial<SpaceData>) => void
}

export function SpaceHeader({
  space,
  canEdit = false,
  isOwner = false,
  isSaving = false,
  onUpdate
}: SpaceHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [title, setTitle] = useState(space.title)
  const [description, setDescription] = useState(space.description || '')

  const handleTitleSave = () => {
    if (title !== space.title) {
      onUpdate?.({ title })
    }
    setIsEditingTitle(false)
  }

  const handleDescriptionSave = () => {
    if (description !== space.description) {
      onUpdate?.({ description })
    }
    setIsEditingDescription(false)
  }

  const togglePublic = () => {
    onUpdate?.({ isPublic: !space.isPublic })
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      // toast success message
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-4">
      {/* 标题区域 */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          {isEditingTitle && canEdit ? (
            <div className="flex items-center space-x-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave()
                  } else if (e.key === 'Escape') {
                    setTitle(space.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="text-2xl font-bold border-none shadow-none p-0 h-auto bg-transparent"
                autoFocus
              />
              <Button size="sm" onClick={handleTitleSave}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-foreground">
                {space.title}
              </h1>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingTitle(true)}
                  className="h-8 w-8"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* 描述 */}
          {isEditingDescription && canEdit ? (
            <div className="flex items-start space-x-2">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDescriptionSave()
                  } else if (e.key === 'Escape') {
                    setDescription(space.description || '')
                    setIsEditingDescription(false)
                  }
                }}
                placeholder="添加描述..."
                className="border-none shadow-none p-0 h-auto bg-transparent text-muted-foreground"
                autoFocus
              />
              <Button size="sm" onClick={handleDescriptionSave}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => canEdit && setIsEditingDescription(true)}
            >
              <p className="text-muted-foreground">
                {space.description || (canEdit ? '点击添加描述...' : '')}
              </p>
              {canEdit && space.description && (
                <Edit3 className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-2">
          {isSaving && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 animate-spin" />
              保存中...
            </div>
          )}

          <Button variant="outline" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            分享
          </Button>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={togglePublic}>
                  {space.isPublic ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      设为私有
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      设为公开
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  删除空间
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 元信息 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={space.owner?.image || ''} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>{space.owner?.name || '匿名用户'}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>更新于</span>
            <span>{formatRelativeTime(space.updatedAt)}</span>
          </div>

          <div className="flex items-center space-x-1">
            {space.isPublic ? (
              <>
                <Eye className="h-4 w-4" />
                <span>公开</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                <span>私有</span>
              </>
            )}
          </div>
        </div>

        {/* 社交数据 */}
        {space.isPublic && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>0</span>
            </div>
          </div>
        )}
      </div>

      {/* 标签 */}
      {space.tags && space.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {space.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
