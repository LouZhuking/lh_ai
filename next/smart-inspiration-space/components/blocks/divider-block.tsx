'use client'

import { Block } from '@/types/block'
import { BlockWrapper } from './block-wrapper'

interface DividerBlockProps {
  block: Block
  isActive?: boolean
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAddBlock?: (position: 'before' | 'after', type?: string) => void
}

export function DividerBlock({
  block,
  isActive = false,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
}: DividerBlockProps) {
  return (
    <BlockWrapper
      block={block}
      isActive={isActive}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onAddBlock={onAddBlock}
    >
      <div className="block-content py-4">
        <hr className="border-t border-border" />
      </div>
    </BlockWrapper>
  )
}
