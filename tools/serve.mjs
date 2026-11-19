#!/usr/bin/env node
// A small static server for previewing dist/ locally. No dependencies.
//   node tools/serve.mjs [--port 4801] [--root dist]
// Binds to 127.0.0.1 only. Supports Range requests so videos can seek (Safari needs them to play).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => {
	const i = process.argv.indexOf(`--${name}`);
	return i < 0 ? fallback : process.argv[i + 1];
};
const port = Number(arg('port', 4801));
if (port < 4801 || port > 4809) {
	console.error('This preview only uses ports 4801 to 4809.');
	process.exit(1);
}
const root = path.resolve(arg('root', path.join(here, '..', 'dist')));

const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.jsonc': 'text/plain; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.mp4': 'video/mp4',
	'.m4v': 'video/mp4',
	'.webm': 'video/webm',
	'.vtt': 'text/vtt; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.md': 'text/plain; charset=utf-8',
	'.ico': 'image/x-icon',
};

function send404(res) {
	const page = path.join(root, '404.html');
	res.statusCode = 404;
	if (fs.existsSync(page)) {
		res.setHeader('Content-Type', types['.html']);
		fs.createReadStream(page).pipe(res);
	} else {
		res.end('Not found');
	}
}

const server = http.createServer((req, res) => {
	let pathname;
	try {
		pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
	} catch {
		res.statusCode = 400;
		res.end('Bad request');
		return;
	}
	let file = path.join(root, pathname);
	if (!file.startsWith(root)) {
		res.statusCode = 403;
		res.end('Forbidden');
		return;
	}
	if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
		file = path.join(file, 'index.html');
	}
	if (!fs.existsSync(file)) {
		send404(res);
		return;
	}
	const stat = fs.statSync(file);
	res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] || 'application/octet-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	const range = req.headers.range && req.headers.range.match(/^bytes=(\d*)-(\d*)$/);
	if (range) {
		let start = range[1] ? Number(range[1]) : NaN;
		let end = range[2] ? Number(range[2]) : NaN;
		if (Number.isNaN(start)) {
			start = Math.max(0, stat.size - end);
			end = stat.size - 1;
		} else if (Number.isNaN(end) || end >= stat.size) {
			end = stat.size - 1;
		}
		if (start > end || start >= stat.size) {
			res.statusCode = 416;
			res.setHeader('Content-Range', `bytes */${stat.size}`);
			res.end();
			return;
		}
		res.statusCode = 206;
		res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
		res.setHeader('Content-Length', end - start + 1);
		if (req.method === 'HEAD') {
			res.end();
			return;
		}
		fs.createReadStream(file, { start, end }).pipe(res);
		return;
	}
	res.setHeader('Content-Length', stat.size);
	if (req.method === 'HEAD') {
		res.end();
		return;
	}
	fs.createReadStream(file).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
	console.log(`Serving ${root} at http://localhost:${port}/ (pid ${process.pid})`);
});
