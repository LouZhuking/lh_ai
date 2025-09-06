export interface BlockContent {
  text?: string
  level?: number
  completed?: boolean
  code?: string
  language?: string
  author?: string
  url?: string
  alt?: string
  items?: string[]
  [key: string]: string | number | boolean | string[] | undefined
}

// 为 createNewBlock 函数定义内容参数类型
export type CreateBlockContent = Partial<BlockContent>

// 为 updateBlock 函数定义更新内容类型 
export type UpdateBlockContent = Partial<BlockContent>

export interface Block {
  id: string
  type: 'paragraph' | 'heading' | 'todo' | 'code' | 'quote' | 'image' | 'list' | 'divider'
  content: BlockContent
  order: number
  spaceId: string
  aiTags?: string[]
  aiSummary?: string
  isPublic?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlockPosition {
  blockId: string
  position: 'before' | 'after'
}

export interface BlockEditor {
  blocks: Block[]
  activeBlockId?: string
  isEditing: boolean
}

// 用户信息类型
export interface SpaceOwner {
  id: string
  name?: string | null
  image?: string | null
  email?: string
}

export interface SpaceData {
  id: string
  title: string
  description?: string
  isPublic: boolean
  content?: string
  ownerId: string
  owner?: SpaceOwner  // 可选的完整用户信息
  tags: Array<{
    id: string
    name: string
    color?: string
  }>
  blocks: Block[]
  createdAt: Date
  updatedAt: Date
}
