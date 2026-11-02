/**
 * CloudBase HTTP 云函数：用 Node 原生 http 托管打包后的前端（SPA）
 *
 * 职责：
 * 1. 静态资源托管：`dist` 目录下的文件按扩展名返回正确 Content-Type
 * 2. SPA 回退：无扩展名的路由路径统一回退到 index.html
 * 3. `/rpc` 反向代理：把同域名的 /rpc 请求转发到 API_ORIGIN（后端 orpc-api），
 *    这样页面无论挂在默认域名还是自定义域名，前端都可以走同源请求
 */
import { createReadStream, statSync } from 'node:fs';
import { createServer, request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { extname, join, resolve, sep } from 'node:path';

const HOST = process.env.HOST?.trim();
const PORT = Number(process.env.PORT);
/** 后端 oRPC 服务源，例如 https://<env>.app.tcloudbase.com */
const API_ORIGIN = (process.env.API_ORIGIN ?? '').trim();

/** 静态资源根目录：函数目录下的 dist */
const ROOT = resolve(import.meta.dirname, 'dist');
const INDEX_FILE = join(ROOT, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
};

/** 读取文件状态，不存在或异常时返回 null */
function statOrNull(filePath) {
  try {
    return statSync(filePath);
  } catch {
    return null;
  }
}

/** 命中缓存头：带 hash 的构建产物长缓存，其余不缓存 */
function cacheControlFor(pathname) {
  return pathname.startsWith('/assets/')
    ? 'public, max-age=31536000, immutable'
    : 'no-cache';
}

/** 输出文件（支持 Range 之外的简单场景，HEAD 只回头） */
function sendFile(req, res, filePath, statusCode = 200) {
  const stat = statOrNull(filePath);
  if (!stat || !stat.isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
  res.writeHead(statusCode, {
    'content-type': MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'content-length': stat.size,
    'cache-control': cacheControlFor(pathname),
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
}

/** 静态资源请求处理（含 SPA 回退） */
function handleStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { allow: 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  // 归一化后必须仍在 ROOT 内，防止路径穿越
  const filePath = resolve(ROOT, `.${decoded === '/' ? '/index.html' : decoded}`);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  const stat = statOrNull(filePath);
  if (stat?.isFile()) {
    sendFile(req, res, filePath);
    return;
  }
  if (stat?.isDirectory()) {
    sendFile(req, res, join(filePath, 'index.html'));
    return;
  }

  // 有扩展名的资源找不到 → 真 404；无扩展名视为前端路由 → 回退 index.html
  if (extname(decoded) || decoded.split('/').some((segment) => segment.startsWith('.'))) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  sendFile(req, res, INDEX_FILE);
}

/** 反向代理 /rpc 到后端函数 */
function proxyToApi(req, res) {
  if (!API_ORIGIN) {
    res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('API_ORIGIN is not configured');
    return;
  }

  let target;
  try {
    target = new URL(req.url ?? '/', API_ORIGIN);
  } catch {
    res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('API_ORIGIN is invalid');
    return;
  }

  const request = target.protocol === 'https:' ? httpsRequest : httpRequest;
  const headers = { ...req.headers, host: target.host, 'x-forwarded-host': req.headers.host ?? '' };
  // 由 Node 按新目标重新计算，避免与上游不匹配
  delete headers['content-length'];
  delete headers['connection'];

  const upstream = request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstream.on('error', (error) => {
    if (!res.headersSent) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    }
    res.end(`Bad gateway: ${error.message}`);
  });

  // 原始 body 原样透传（含流式响应场景）
  req.pipe(upstream);
}

const server = createServer((req, res) => {
  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;

  if (pathname === '/rpc' || pathname.startsWith('/rpc/')) {
    proxyToApi(req, res);
    return;
  }

  handleStatic(req, res);
});

if (!HOST || !Number.isInteger(PORT) || PORT < 1 || PORT > 65_535) {
  throw new Error('HOST and a valid PORT must be provided in the CloudBase function environment.');
}

server.listen(PORT, HOST, () => {
  console.log(`web listening on ${HOST}:${PORT}, root=${ROOT}, apiOrigin=${API_ORIGIN || '(none)'}`);
});