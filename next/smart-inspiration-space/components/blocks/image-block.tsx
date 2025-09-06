'use client'

import { useState, useRef } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Link as LinkIcon } from 'lucide-react'

interface ImageBlockProps {
  block: Block
  isActive?: boolean
  isEditing?: boolean
  onUpdate?: (content: any) => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAddBlock?: (position: 'before' | 'after', type?: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export function ImageBlock({
  block,
  isActive = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
}: ImageBlockProps) {
  const [url, setUrl] = useState(block.content.url || '')
  const [alt, setAlt] = useState(block.content.alt || '')
  const [isEditing, setIsEditing] = useState(!block.content.url)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlSubmit = () => {
    if (url) {
      onUpdate?.({ url, alt })
      setIsEditing(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 这里应该上传文件到服务器或云存储
      // 现在只是创建一个本地URL作为演示
      const fileUrl = URL.createObjectURL(file)
      setUrl(fileUrl)
      setAlt(file.name)
      onUpdate?.({ url: fileUrl, alt: file.name })
      setIsEditing(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (isEditing) {
    return (
      <BlockWrapper
        block={block}
        isActive={isActive}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onAddBlock={onAddBlock}
      >
        <div className="block-content p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={triggerFileInput}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                上传图片
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                使用链接
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入图片URL..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit()
                  }
                }}
              />
              <Input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="图片描述 (可选)"
              />
              <Button onClick={handleUrlSubmit} className="w-full">
                确认
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper
      block={block}
      isActive={isActive}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onAddBlock={onAddBlock}
    >
      <div className="block-content">
        <div
          className="relative group cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <img
            src={url}
            alt={alt}
            className="w-full max-w-2xl rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4='
            }}
          />

          {alt && (
            <div className="mt-2 text-sm text-muted-foreground text-center">
              {alt}
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button variant="secondary" size="sm">
              更换图片
            </Button>
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
