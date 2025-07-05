# html5 王者对象 Blob

- 图片转成 base64 字符串编码
- atob(base64) 二进制的字符串编码
- for 每一个字符
  charCoedeAt() 0-255 8 byte 的整数
  Unit8Array()
- 二进制的文件对象描述 new Blob([unit8Array],类型)
- 二进制层面上去压缩，切割，修改
  浏览器将会为二进制提供一个临时访问的 URL 地址
- URL.createObjectURL(blob)
