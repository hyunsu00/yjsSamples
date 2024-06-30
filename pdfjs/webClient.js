import * as Y from 'yjs'
import {WebsocketProvider} from 'y-websocket'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs"

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdfContainer = document.getElementById('pdf-container');
const ydoc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'pdf-room', ydoc, {WebSocketPolyfill: WebSocket})
const yAnnotations = ydoc.getArray('annotations');

yAnnotations.observe(event => {
    renderAnnotations();
});

async function loadPDF(url) {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;

    pdfContainer.appendChild(canvas);
  }

  function renderAnnotations() {
    const annotations = yAnnotations.toArray();
    pdfContainer.querySelectorAll('.annotation').forEach(el => el.remove());

    annotations.forEach(annotation => {
      const annotationDiv = document.createElement('div');
      annotationDiv.className = 'annotation';
      annotationDiv.style.top = annotation.top + 'px';
      annotationDiv.style.left = annotation.left + 'px';
      annotationDiv.textContent = annotation.text;
      pdfContainer.appendChild(annotationDiv);
    });
  }

  pdfContainer.addEventListener('dblclick', (event) => {
    const rect = pdfContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const text = prompt('Enter annotation text:');
    if (text) {
      yAnnotations.push([{ top: y, left: x, text }]);
    }
  });

  provider.on('sync', isSynced => {
    if (isSynced) {
      renderAnnotations();
    }
  });

  loadPDF('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');