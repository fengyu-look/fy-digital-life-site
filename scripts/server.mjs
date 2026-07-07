import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootArg = process.argv[2] || "public";
const port = Number(process.argv[3] || 5173);
const cwd = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(cwd, "..", rootArg);

const types = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const rangeTypes = new Set([".mp4", ".mov", ".webm"]);

function cacheControlFor(ext) {
  if (ext === ".html") return "no-store";
  return "public, max-age=3600";
}

function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header || "");
  if (!match) return null;

  let start = match[1] === "" ? null : Number(match[1]);
  let end = match[2] === "" ? null : Number(match[2]);

  if (start === null && end === null) return null;
  if (start === null) {
    start = Math.max(size - end, 0);
    end = size - 1;
  } else {
    end = end === null ? size - 1 : Math.min(end, size - 1);
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start < 0) {
    return null;
  }

  return { start, end };
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = decoded.replace(/^\/+/, "");
  const resolved = path.resolve(root, clean);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

async function resolveFile(reqUrl) {
  const url = new URL(reqUrl, `http://localhost:${port}`);
  let candidate = safePath(url.pathname);
  if (!candidate) return null;

  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    if (info.isDirectory()) {
      const index = path.join(candidate, "index.html");
      if ((await stat(index)).isFile()) return index;
    }
  } catch {}

  const routeIndex = path.join(root, url.pathname.replace(/^\/+/, ""), "index.html");
  try {
    if ((await stat(routeIndex)).isFile()) return routeIndex;
  } catch {}

  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const info = await stat(file);
  const contentType = types[ext] || "application/octet-stream";
  const cacheControl = cacheControlFor(ext);
  const range = rangeTypes.has(ext) ? parseRange(req.headers.range, info.size) : null;

  if (req.headers.range && rangeTypes.has(ext) && !range) {
    res.writeHead(416, {
      "access-control-allow-origin": "*",
      "cache-control": cacheControl,
      "content-range": `bytes */${info.size}`,
      "content-type": contentType,
    });
    res.end();
    return;
  }

  if (range) {
    res.writeHead(206, {
      "accept-ranges": "bytes",
      "access-control-allow-origin": "*",
      "cache-control": cacheControl,
      "content-length": range.end - range.start + 1,
      "content-range": `bytes ${range.start}-${range.end}/${info.size}`,
      "content-type": contentType,
    });
    createReadStream(file, range).pipe(res);
    return;
  }

  res.writeHead(200, {
    "accept-ranges": rangeTypes.has(ext) ? "bytes" : "none",
    "access-control-allow-origin": "*",
    "cache-control": cacheControl,
    "content-length": info.size,
    "content-type": contentType,
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
  console.log(`Serving ${root}`);
});
