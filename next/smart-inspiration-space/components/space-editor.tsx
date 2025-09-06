'use client'

import { useState } from 'react'
import { SpaceData, Block } from '@/types/block'
import { BlockEditor } from './block-editor'
import { SpaceHeader } from './space-header'
import { useToast } from '@/hooks/use-toast'

interface SpaceEditorProps {
  space: SpaceData
  canEdit?: boolean
  isOwner?: boolean
}

export function SpaceEditor({ space, canEdit = false, isOwner = false }: SpaceEditorProps) {
  const [spaceData, setSpaceData] = useState<SpaceData>(space)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async (blocks: Block[]) => {
    if (!canEdit) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/spaces/${space.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks: blocks.map(block => ({
            id: block.id,
            type: block.type,
            content: block.content,
            order: block.order,
            aiTags: block.aiTags,
            isPublic: block.isPublic,
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      setSpaceData(prev => ({ ...prev, blocks, updatedAt: new Date() }))
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSpaceUpdate = async (updates: Partial<SpaceData>) => {
    if (!canEdit) return

    try {
      const response = await fetch(`/api/spaces/${space.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update space')
      }

      setSpaceData(prev => ({ ...prev, ...updates, updatedAt: new Date() }))

      toast({
        title: "更新成功",
        description: "空间信息已保存"
      })
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: "更新失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SpaceHeader
        space={spaceData}
        canEdit={canEdit}
        isOwner={isOwner}
        isSaving={isSaving}
        onUpdate={handleSpaceUpdate}
      />

      <div className="bg-background rounded-lg border p-6">
        <BlockEditor
          space={spaceData}
          onSave={canEdit ? handleSave : undefined}
        />
      </div>
    </div>
  )
}
