'use client'

import { Block } from '@/types/block'
import { ParagraphBlock } from './paragraph-block'
import { HeadingBlock } from './heading-block'
import { TodoBlock } from './todo-block'
import { CodeBlock } from './code-block'
import { QuoteBlock } from './quote-block'
import { ImageBlock } from './image-block'
import { ListBlock } from './list-block'
import { DividerBlock } from './divider-block'

interface BlockRendererProps {
  block: Block
  isActive?: boolean
  isEditing?: boolean
  onUpdate?: (blockId: string, content: any) => void
  onDelete?: (blockId: string) => void
  onMoveUp?: (blockId: string) => void
  onMoveDown?: (blockId: string) => void
  onAddBlock?: (position: 'before' | 'after', blockId: string, type?: string) => void
  onFocus?: (blockId: string) => void
  onBlur?: () => void
}

export function BlockRenderer({
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
}: BlockRendererProps) {

  const handleUpdate = (content: any) => {
    onUpdate?.(block.id, content)
  }

  const handleDelete = () => {
    onDelete?.(block.id)
  }

  const handleMoveUp = () => {
    onMoveUp?.(block.id)
  }

  const handleMoveDown = () => {
    onMoveDown?.(block.id)
  }

  const handleAddBlock = (position: 'before' | 'after', type?: string) => {
    onAddBlock?.(position, block.id, type)
  }

  const handleFocus = () => {
    onFocus?.(block.id)
  }

  const commonProps = {
    block,
    isActive,
    isEditing,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    onAddBlock: handleAddBlock,
    onFocus: handleFocus,
    onBlur,
  }

  switch (block.type) {
    case 'paragraph':
      return <ParagraphBlock {...commonProps} />
    case 'heading':
      return <HeadingBlock {...commonProps} />
    case 'todo':
      return <TodoBlock {...commonProps} />
    case 'code':
      return <CodeBlock {...commonProps} />
    case 'quote':
      return <QuoteBlock {...commonProps} />
    case 'image':
      return <ImageBlock {...commonProps} />
    case 'list':
      return <ListBlock {...commonProps} />
    case 'divider':
      return <DividerBlock {...commonProps} />
    default:
      return <ParagraphBlock {...commonProps} />
  }
}
