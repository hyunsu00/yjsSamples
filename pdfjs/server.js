const WebSocket = require('ws');
const http = require('http');
const Y = require('yjs');
const WebSocketServer = WebSocket.Server;

const server = http.createServer();
const wss = new WebSocketServer({ server });

const docs = new Map();

wss.on('connection', (ws) => {
  const doc = new Y.Doc();
  docs.set(ws, doc);

  ws.on('close', () => {
    docs.delete(ws);
  });
});

server.listen(1234, () => {
  console.log('WebSocket server is running on ws://localhost:1234');
});
