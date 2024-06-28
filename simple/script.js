// PDF.js 워커 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

import * as Y from 'https://cdn.jsdelivr.net/npm/yjs@13.5.42/dist/yjs.mjs';
import { WebsocketProvider } from 'https://cdn.jsdelivr.net/npm/y-websocket/dist/y-websocket.js';

// Yjs 문서 및 WebSocket 프로바이더 설정
const ydoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:8080', 'pdf-room', ydoc);
const yarray = ydoc.getArray('annotations');

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

// PDF 로드
pdfjsLib.getDocument('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf').promise.then(function(pdf) {
    pdfDoc = pdf;
    renderPage(pageNum);
});

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            renderAnnotations();
        });
    });
}

function renderAnnotations() {
    const viewer = document.getElementById('pdf-viewer');
    viewer.querySelectorAll('.annotation').forEach(el => el.remove());

    yarray.toArray().forEach(annotation => {
        const el = document.createElement('div');
        el.className = 'annotation';
        el.style.left = annotation.x + 'px';
        el.style.top = annotation.y + 'px';
        el.style.width = annotation.width + 'px';
        el.style.height = annotation.height + 'px';
        viewer.appendChild(el);
    });
}

document.getElementById('add-annotation').addEventListener('click', function() {
    const annotation = {
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        width: 100,
        height: 100
    };
    yarray.push([annotation]);
});

yarray.observe(renderAnnotations);

// WebSocket 연결 상태 표시 (선택사항)
provider.on('status', event => {
    console.log(event.status); // 연결 상태 로그
});