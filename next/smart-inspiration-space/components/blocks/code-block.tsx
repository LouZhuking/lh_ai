'use client'

import { useState, useRef, useEffect } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
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

const languages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'go', 'rust',
  'html', 'css', 'json', 'yaml', 'markdown', 'sql', 'bash', 'plain'
]

export function CodeBlock({
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
}: CodeBlockProps) {
  const [code, setCode] = useState(block.content.code || '')
  const [language, setLanguage] = useState(block.content.language || 'javascript')
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isLocalEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(code.length, code.length)
    }
  }, [isLocalEditing, code])

  const handleClick = () => {
    if (!isLocalEditing) {
      setIsLocalEditing(true)
      onFocus?.()
    }
  }

  const handleBlur = () => {
    setIsLocalEditing(false)
    if (code !== block.content.code || language !== block.content.language) {
      onUpdate?.({ code, language })
    }
    onBlur?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)

      // 设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    } else if (e.key === 'Escape') {
      handleBlur()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
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
      <div className="block-content rounded border bg-muted/50">
        {/* 代码块头部 */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value)
              onUpdate?.({ code, language: e.target.value })
            }}
            className="text-xs bg-transparent border-none outline-none text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 w-6 p-0"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* 代码内容 */}
        <div
          className="p-3 cursor-text"
          onClick={handleClick}
        >
          {isLocalEditing ? (
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none resize-none font-mono text-sm min-h-[4rem]"
              placeholder="输入代码..."
              spellCheck={false}
              style={{
                height: 'auto',
                minHeight: '4rem',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = target.scrollHeight + 'px'
              }}
            />
          ) : (
            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              <code className={`language-${language}`}>
                {code || '输入代码...'}
              </code>
            </pre>
          )}
        </div>
      </div>
    </BlockWrapper>
  )
}
