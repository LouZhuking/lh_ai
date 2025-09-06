// 邮箱验证正则
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 密码验证正则 - 至少8位，包含字母和数字
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

// 用户名验证正则 - 3-20位，字母数字下划线
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

// 手机号验证正则（中国大陆）
export const phoneRegex = /^1[3-9]\d{9}$/

// URL验证正则
export const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

// 文件哈希验证正则（SHA-256）
export const hashRegex = /^[a-f0-9]{64}$/

// 标签名验证正则 - 1-20位，中英文数字
export const tagNameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/

// 空间标题验证正则 - 1-100位
export const spaceTitleRegex = /^.{1,100}$/

// 验证工具函数
export const validators = {
  email: (email: string) => emailRegex.test(email),
  password: (password: string) => passwordRegex.test(password),
  username: (username: string) => usernameRegex.test(username),
  phone: (phone: string) => phoneRegex.test(phone),
  url: (url: string) => urlRegex.test(url),
  hash: (hash: string) => hashRegex.test(hash),
  tagName: (tagName: string) => tagNameRegex.test(tagName),
  spaceTitle: (title: string) => spaceTitleRegex.test(title)
}
