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

  ws.on('message', (message) => {
    Y.applyUpdate(doc, new Uint8Array(message));
    docs.forEach((otherDoc, otherWs) => {
      if (ws !== otherWs) {
        otherWs.send(message);
      }
    });
  });

  ws.on('close', () => {
    docs.delete(ws);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});
