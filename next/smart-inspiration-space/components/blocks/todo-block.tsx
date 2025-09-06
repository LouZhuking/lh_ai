'use client'

import { useState, useRef, useEffect } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'
import { Checkbox } from '@/components/ui/checkbox'

interface TodoBlockProps {
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

export function TodoBlock({
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
}: TodoBlockProps) {
  const [content, setContent] = useState(block.content.text || '')
  const [completed, setCompleted] = useState(block.content.completed || false)
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
    if (content !== block.content.text || completed !== block.content.completed) {
      onUpdate?.({ text: content, completed })
    }
    onBlur?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsLocalEditing(false)
      onAddBlock?.('after', 'todo')
      if (content !== block.content.text || completed !== block.content.completed) {
        onUpdate?.({ text: content, completed })
      }
    } else if (e.key === 'Backspace' && content === '' && e.metaKey) {
      e.preventDefault()
      onDelete?.()
    }
  }

  const handleCheckedChange = (checked: boolean) => {
    setCompleted(checked)
    onUpdate?.({ text: content, completed: checked })
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
        <div className="flex items-center space-x-3 w-full">
          <Checkbox
            checked={completed}
            onCheckedChange={handleCheckedChange}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1">
            {isLocalEditing ? (
              <input
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="block-content w-full outline-none border-none bg-transparent"
                placeholder="待办事项..."
              />
            ) : (
              <span
                className={`block-content ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {content || '待办事项...'}
              </span>
            )}
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
