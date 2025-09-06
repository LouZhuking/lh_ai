import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function parseWikiLinks(text: string): Array<{ text: string; isLink: boolean; link?: string }> {
  const wikiLinkRegex = /\[\[(.*?)\]\]/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = wikiLinkRegex.exec(text)) !== null) {
    // 添加链接前的文本
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isLink: false
      })
    }

    // 添加链接
    parts.push({
      text: match[1],
      isLink: true,
      link: match[1].toLowerCase().replace(/\s+/g, '-')
    })

    lastIndex = match.index + match[0].length
  }

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isLink: false
    })
  }

  return parts
}
