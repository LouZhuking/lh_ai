'use client'

import { useState, useRef, useEffect } from 'react'
import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'

interface ListBlockProps {
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

export function ListBlock({
  block,
  isActive = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onFocus,
}: ListBlockProps) {
  const [items, setItems] = useState<string[]>(block.content.items || [''])
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (activeIndex >= 0 && inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus()
    }
  }, [activeIndex])

  const updateItems = (newItems: string[]) => {
    setItems(newItems)
    onUpdate?.({ items: newItems.filter(item => item.trim() !== '') })
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  const handleItemBlur = (index: number) => {
    const newItems = items.filter((item, i) => item.trim() !== '' || i === items.length - 1)
    if (newItems.length === 0) {
      newItems.push('')
    }
    updateItems(newItems)
    setActiveIndex(-1)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newItems = [...items]
      newItems.splice(index + 1, 0, '')
      setItems(newItems)
      setActiveIndex(index + 1)
    } else if (e.key === 'Backspace' && items[index] === '' && items.length > 1) {
      e.preventDefault()
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
      setActiveIndex(Math.max(0, index - 1))
    }
  }

  const addItem = () => {
    const newItems = [...items, '']
    setItems(newItems)
    setActiveIndex(newItems.length - 1)
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      updateItems(newItems)
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
      <div className="block-content p-2">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 group">
              <span className="text-muted-foreground text-sm w-4">•</span>
              <input
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                onBlur={() => handleItemBlur(index)}
                onFocus={() => {
                  setActiveIndex(index)
                  onFocus?.()
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="flex-1 bg-transparent border-none outline-none"
                placeholder="列表项..."
              />
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem(index)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={addItem}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="mr-1 h-3 w-3" />
            添加项目
          </Button>
        </div>
      </div>
    </BlockWrapper>
  )
}
