'use client'

import { useState, useCallback, useEffect } from 'react'
import { Block, SpaceData, BlockContent, CreateBlockContent, UpdateBlockContent } from '@/types/block'
import { BlockRenderer } from './blocks/block-renderer'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface BlockEditorProps {
  space: SpaceData
  onSave?: (blocks: Block[]) => void
  className?: string
}

export function BlockEditor({ space, onSave, className }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(space.blocks || [])
  const [activeBlockId, setActiveBlockId] = useState<string>()
  const { toast } = useToast()

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave?.(blocks)
    }, 1000)

    return () => clearTimeout(timer)
  }, [blocks, onSave])

  const createNewBlock = useCallback((type: string = 'paragraph', content: CreateBlockContent = {}): Block => {
    return {
      id: generateId(),
      type: type as Block['type'],
      content: content as BlockContent,
      order: 0,
      spaceId: space.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }, [space.id])

  const addBlock = useCallback((position: 'before' | 'after', targetBlockId: string, type: string = 'paragraph') => {
    const targetIndex = blocks.findIndex(block => block.id === targetBlockId)
    if (targetIndex === -1) return

    const newBlock = createNewBlock(type)
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1

    const newBlocks = [...blocks]
    newBlocks.splice(insertIndex, 0, newBlock)

    // 重新排序
    newBlocks.forEach((block, index) => {
      block.order = index
    })

    setBlocks(newBlocks)
    setActiveBlockId(newBlock.id)
  }, [blocks, createNewBlock])

  const addBlockAtEnd = useCallback(() => {
    const newBlock = createNewBlock('paragraph')
    newBlock.order = blocks.length

    setBlocks([...blocks, newBlock])
    setActiveBlockId(newBlock.id)
  }, [blocks, createNewBlock])

  const updateBlock = useCallback((blockId: string, content: UpdateBlockContent) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? { ...block, content: { ...block.content, ...content } as BlockContent, updatedAt: new Date() }
          : block
      )
    )
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    if (blocks.length <= 1) {
      toast({
        title: "无法删除",
        description: "至少需要保留一个块",
        variant: "destructive"
      })
      return
    }

    const blockIndex = blocks.findIndex(block => block.id === blockId)
    const newBlocks = blocks.filter(block => block.id !== blockId)

    // 重新排序
    newBlocks.forEach((block, index) => {
      block.order = index
    })

    setBlocks(newBlocks)

    // 设置新的活跃块
    if (newBlocks.length > 0) {
      const newActiveIndex = Math.min(blockIndex, newBlocks.length - 1)
      setActiveBlockId(newBlocks[newActiveIndex]?.id)
    }
  }, [blocks, toast])

  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(block => block.id === blockId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(currentIndex, 1)
    newBlocks.splice(newIndex, 0, movedBlock)

    // 重新排序
    newBlocks.forEach((block, index) => {
      block.order = index
    })

    setBlocks(newBlocks)
  }, [blocks])

  // 如果没有块，创建一个默认块
  useEffect(() => {
    if (blocks.length === 0) {
      const defaultBlock = createNewBlock('paragraph')
      setBlocks([defaultBlock])
      setActiveBlockId(defaultBlock.id)
    }
  }, [blocks.length, createNewBlock])

  return (
    <div className={`block-editor ${className || ''}`}>
      <div className="space-y-1">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isActive={activeBlockId === block.id}
            onUpdate={(blockId, content) => updateBlock(blockId, content)}
            onDelete={(blockId) => deleteBlock(blockId)}
            onMoveUp={(blockId) => moveBlock(blockId, 'up')}
            onMoveDown={(blockId) => moveBlock(blockId, 'down')}
            onAddBlock={(position, blockId, type) => addBlock(position, blockId, type)}
            onFocus={(blockId) => setActiveBlockId(blockId)}
            onBlur={() => setActiveBlockId(undefined)}
          />
        ))}
      </div>

      {/* 添加新块按钮 */}
      <div className="mt-4 flex justify-center">
        <Button
          variant="ghost"
          onClick={addBlockAtEnd}
          className="text-muted-foreground hover:text-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加块
        </Button>
      </div>
    </div>
  )
}
