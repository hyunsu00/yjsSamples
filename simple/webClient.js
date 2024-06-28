import * as Y from 'yjs'
import {WebsocketProvider} from 'y-websocket'

const doc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', doc, {WebSocketPolyfill: WebSocket})
const text = doc.getText('shared-text')

text.observe(() => {
    document.getElementById('output').innerText = 'Text has changed to: ' + text.toString()
})

text.insert(0, 'Hello, Yjs!')