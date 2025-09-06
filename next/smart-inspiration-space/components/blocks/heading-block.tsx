'use client'

import { useState, useRef, useEffect } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'
import { cn } from '@/lib/utils'

interface HeadingBlockProps {
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

export function HeadingBlock({
  block,
  isActive = false,
  isEditing = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onFocus,
  onBlur,
}: HeadingBlockProps) {
  const [content, setContent] = useState(block.content.text || '')
  const [level, setLevel] = useState(block.content.level || 1)
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLocalEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(content.length, content.length)
    }
  }, [isLocalEditing, content])

  const handleClick = () => {
    if (!isLocalEditing) {
      setIsLocalEditing(true)
      onFocus?.()
    }
  }

  const handleBlur = () => {
    setIsLocalEditing(false)
    if (content !== block.content.text || level !== block.content.level) {
      onUpdate?.({ text: content, level })
    }
    onBlur?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsLocalEditing(false)
      onAddBlock?.('after', 'paragraph')
      if (content !== block.content.text || level !== block.content.level) {
        onUpdate?.({ text: content, level })
      }
    } else if (e.key === 'Backspace' && content === '' && e.metaKey) {
      e.preventDefault()
      onDelete?.()
    }
  }

  const getHeadingComponent = () => {
    const className = cn(
      "block-content font-bold text-foreground w-full outline-none border-none bg-transparent",
      {
        "text-3xl": level === 1,
        "text-2xl": level === 2,
        "text-xl": level === 3,
        "text-lg": level === 4,
        "text-base": level === 5,
        "text-sm": level === 6,
      }
    )

    const placeholder = `标题 ${level}`

    if (isLocalEditing) {
      return (
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={className}
          placeholder={placeholder}
        />
      )
    }

    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

    return (
      <HeadingTag className={className}>
        {content || placeholder}
      </HeadingTag>
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
      <div
        className="block-content p-2 rounded cursor-text min-h-[2rem] flex items-center"
        onClick={handleClick}
      >
        <div className="flex items-center space-x-2 w-full">
          {/* 标题级别选择器 */}
          <select
            value={level}
            onChange={(e) => {
              const newLevel = parseInt(e.target.value)
              setLevel(newLevel)
              onUpdate?.({ text: content, level: newLevel })
            }}
            className="text-xs bg-muted rounded px-2 py-1 border-none outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <option key={h} value={h}>H{h}</option>
            ))}
          </select>

          <div className="flex-1">
            {getHeadingComponent()}
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
