const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../apps/web');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const requested = path.resolve(root, `.${requestPath === '/' ? '/index.html' : requestPath}`);
  if (!requested.startsWith(root + path.sep) && requested !== path.join(root, 'index.html')) { res.writeHead(403).end('Forbidden'); return; }
  fs.readFile(requested, (error, data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'content-type': types[path.extname(requested)] || 'application/octet-stream', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' });
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('MANDAVEX preview: http://127.0.0.1:4173'));
