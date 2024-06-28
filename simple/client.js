const Y = require('yjs')
const { WebsocketProvider } = require('y-websocket')

const doc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', doc, {WebSocketPolyfill: require('ws')})
const text = doc.getText('shared-text')

text.observe(() => {
  console.log('Text has changed to: ', text.toString())
})

text.insert(0, 'Hello, Yjs!')