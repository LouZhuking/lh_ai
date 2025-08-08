const http = require('http');

const server = http.createServer((req, res) => {
  if(req.url === '/api/test' && req.method === 'GET') {
    res.writeHead(200,{
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })

    res.end(JSON.stringify({
      msg: '跨域成功!!!'
    }))
  }

  // 浏览器发送一个预检请求
  if(req.method === 'OPTIONS' ){
    res.writeHead(200)  // 同意
    res.end()
    return
  }

  if(req.url === '/api/test' && req.method === 'PATCH'){
    
  }

  else {
    res.writeHead(404);
    res.end('Not Found');

  }

})

server.listen(8000, () => {
  console.log('cors server running at http://localhost:8000');
})