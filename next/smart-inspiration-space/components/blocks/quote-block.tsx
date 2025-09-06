'use client'

import { useState, useRef, useEffect } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'

interface QuoteBlockProps {
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

export function QuoteBlock({
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
}: QuoteBlockProps) {
  const [text, setText] = useState(block.content.text || '')
  const [author, setAuthor] = useState(block.content.author || '')
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLocalEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(text.length, text.length)
    }
  }, [isLocalEditing, text])

  const handleClick = () => {
    if (!isLocalEditing) {
      setIsLocalEditing(true)
      onFocus?.()
    }
  }

  const handleBlur = () => {
    setIsLocalEditing(false)
    if (text !== block.content.text || author !== block.content.author) {
      onUpdate?.({ text, author })
    }
    onBlur?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter 换行
      return
    } else if (e.key === 'Enter') {
      e.preventDefault()
      setIsLocalEditing(false)
      onAddBlock?.('after', 'paragraph')
      if (text !== block.content.text || author !== block.content.author) {
        onUpdate?.({ text, author })
      }
    } else if (e.key === 'Backspace' && text === '' && e.metaKey) {
      e.preventDefault()
      onDelete?.()
    }
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
        className="block-content p-4 border-l-4 border-primary bg-muted/30 rounded-r cursor-text"
        onClick={handleClick}
      >
        {isLocalEditing ? (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none resize-none italic text-muted-foreground min-h-[2rem]"
              placeholder="输入引用内容..."
              style={{
                height: 'auto',
                minHeight: '2rem',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = target.scrollHeight + 'px'
              }}
            />
            <input
              ref={authorRef}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-transparent border-none outline-none text-sm text-right"
              placeholder="— 作者"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <blockquote className="italic text-muted-foreground leading-relaxed">
              {text || '输入引用内容...'}
            </blockquote>
            {author && (
              <cite className="text-sm text-right block not-italic">
                — {author}
              </cite>
            )}
          </div>
        )}
      </div>
    </BlockWrapper>
  )
}
