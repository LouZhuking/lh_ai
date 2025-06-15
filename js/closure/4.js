// 参数复用 接收三个参数
function url_curring(protocol){
  return function(hostname,pathname){
    return `${protocol}${hostname}${pathname}`
}

}


const url_https = url_curring('https://')

const url2 = url_https('www.danlaoshi.com','/点赞')
const url3 = url_https('www.danlaoshi.com','/投币')
const url4 = url_https('www.danlaoshi.com','/收藏')
console.log(url2,url3,url4);