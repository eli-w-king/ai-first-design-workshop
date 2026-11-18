import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { BASE } from '../src/data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../docs');
const portFlag = process.argv.indexOf('--port');
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : 4179);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jsonc': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/' || url.pathname === BASE.slice(0, -1)) {
      res.writeHead(302, { Location: BASE + url.search }); res.end(); return;
    }
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length);
    else pathname = pathname.slice(1);
    let target = path.resolve(root, pathname);
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try {
      if ((await fs.stat(target)).isDirectory()) {
        if (!url.pathname.endsWith('/')) { res.writeHead(302, { Location: url.pathname + '/' + url.search }); res.end(); return; }
        target = path.join(target, 'index.html');
      }
      const body = await fs.readFile(target);
      res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(404, { 'Content-Type': types['.html'] });
      res.end(await fs.readFile(path.join(root, '404.html')));
    }
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${BASE} (PID ${process.pid})`));
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
