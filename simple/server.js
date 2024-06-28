const WebSocket = require('ws')
const http = require('http')
const url = require('url')
const fs = require('fs')
const wss = new WebSocket.Server({ noServer: true })
const { setupWSConnection } = require('y-websocket/bin/utils')

const server = http.createServer((request, response) => {
  const reqUrl = url.parse(request.url, true)

  if (reqUrl.pathname === '/') {
    response.writeHead(200)
    response.end('Yjs WebSocket Server')
  } else if (reqUrl.pathname === '/client.html') {
    fs.readFile('./client.html', (err, data) => {
      if (err) {
        response.writeHead(404)
        response.end(JSON.stringify(err))
        return
      }
      response.writeHead(200)
      response.end(data)
    })
  } else if (reqUrl.pathname === '/dist/webClient.js') {
    fs.readFile('./dist/webClient.js', (err, data) => {
      if (err) {
        response.writeHead(404)
        response.end(JSON.stringify(err))
        return
      }
      response.writeHead(200)
      response.end(data)
    })
  } else if (reqUrl.pathname === '/dist/webClient.js.map') {
    fs.readFile('./dist/webClient.js.map', (err, data) => {
      if (err) {
        response.writeHead(404)
        response.end(JSON.stringify(err))
        return
      }
      response.writeHead(200)
      response.end(data)
    })
  } else {
    response.writeHead(404)
    response.end()
  }
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request)
  })
})

server.listen(1234)
console.log('Yjs WebSocket Server running at ws://localhost:1234')