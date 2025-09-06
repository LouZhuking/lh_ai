'use client'

import { useState, useRef, useEffect } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'
import { parseWikiLinks } from '@/lib/utils'

interface ParagraphBlockProps {
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

export function ParagraphBlock({
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
}: ParagraphBlockProps) {
  const [content, setContent] = useState(block.content.text || '')
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isLocalEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(content.length, content.length)
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
    if (content !== block.content.text) {
      onUpdate?.({ text: content })
    }
    onBlur?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsLocalEditing(false)
      onAddBlock?.('after', 'paragraph')
      if (content !== block.content.text) {
        onUpdate?.({ text: content })
      }
    } else if (e.key === 'Backspace' && content === '' && e.metaKey) {
      e.preventDefault()
      onDelete?.()
    }
  }

  const renderContent = () => {
    if (!content && !isLocalEditing) {
      return <span className="text-muted-foreground">输入内容或输入 '/' 选择块类型...</span>
    }

    if (isLocalEditing) {
      return (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="block-content resize-none border-none outline-none bg-transparent w-full min-h-[1.5em]"
          placeholder="输入内容或输入 '/' 选择块类型..."
          rows={1}
          style={{
            height: 'auto',
            minHeight: '1.5em',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = target.scrollHeight + 'px'
          }}
        />
      )
    }

    // 渲染带有双向链接的内容
    const parts = parseWikiLinks(content)
    return (
      <div className="prose prose-sm max-w-none">
        {parts.map((part, index) => (
          part.isLink ? (
            <span key={index} className="wiki-link">
              {part.text}
            </span>
          ) : (
            <span key={index}>{part.text}</span>
          )
        ))}
      </div>
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
        {renderContent()}
      </div>
    </BlockWrapper>
  )
}
