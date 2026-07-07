import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { origin, routes } from "./routes.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(repo, "public");
const assetsDir = path.join(publicDir, "assets");
const maxResourcePasses = 12;

const assetMap = new Map();
const pendingAssets = [];
const seenAssets = new Set();

const mirroredHosts = new Set([
  "framerusercontent.com",
  "fonts.gstatic.com",
  "events.framer.com",
]);

function hash(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 10);
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function routeFile(route) {
  return route === "/"
    ? path.join(publicDir, "index.html")
    : path.join(publicDir, route.slice(1), "index.html");
}

function isMirroredUrl(value) {
  try {
    const url = new URL(value);
    return mirroredHosts.has(url.hostname);
  } catch {
    return false;
  }
}

function localAssetPath(remote) {
  const url = new URL(remote);
  const parsedPath = safeDecode(url.pathname).replace(/^\/+/, "");
  const ext = path.extname(parsedPath);
  const base = ext ? parsedPath.slice(0, -ext.length) : parsedPath;
  const suffix = url.search ? `.${hash(url.search)}` : "";
  return `/assets/${url.hostname}/${base}${suffix}${ext}`;
}

function enqueueAsset(remote) {
  const normalized = remote.replaceAll("&amp;", "&");
  if (!isMirroredUrl(normalized) || seenAssets.has(normalized)) return;
  const url = new URL(normalized);
  if (url.pathname.endsWith("/") && !url.search) return;
  seenAssets.add(normalized);
  const local = localAssetPath(normalized);
  assetMap.set(normalized, local);
  pendingAssets.push(normalized);
}

function collectUrls(text) {
  const patterns = [
    /https:\/\/(?:framerusercontent\.com|fonts\.gstatic\.com|events\.framer\.com)[^"'`<>)\\\s]+/g,
    /url\((https:\/\/(?:framerusercontent\.com|fonts\.gstatic\.com|events\.framer\.com)[^)]+)\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text))) {
      const raw = (match[1] || match[0]).replace(/^["']|["']$/g, "");
      enqueueAsset(raw);
    }
  }
}

function collectRelativeModules(text, remote) {
  const remoteUrl = new URL(remote);
  const pattern = /(?:import\(\s*|from\s*)[`"']\.\/([^`"']+)[`"']/g;
  let match;
  while ((match = pattern.exec(text))) {
    const child = new URL(match[1], remoteUrl).href;
    enqueueAsset(child);
  }
}

function rewriteText(text) {
  let out = text;
  const sorted = [...assetMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [remote, local] of sorted) {
    out = out.split(remote).join(local);
    out = out.split(remote.replaceAll("&", "&amp;")).join(local);
  }

  out = out
    .replaceAll(`${origin}/`, "/")
    .replaceAll(`${origin}`, "/")
    .replaceAll('href="./about"', 'href="/studio/digital-life"')
    .replaceAll('href="./work"', 'href="/"')
    .replaceAll('href="./concept-lab"', 'href="/studio/vibe-coding-lab"');

  return out;
}

async function fetchBuffer(url, attempts = 2) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "accept": "*/*",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
        },
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} for ${url}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

async function writeAsset(remote, bytes) {
  const local = assetMap.get(remote);
  const target = path.join(publicDir, local);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}

async function mirrorAsset(remote) {
  const bytes = await fetchBuffer(remote);
  let output = bytes;
  const pathname = new URL(remote).pathname;
  if (/\.(?:mjs|js|css|json|svg)$/i.test(pathname)) {
    const text = bytes.toString("utf8");
    collectUrls(text);
    collectRelativeModules(text, remote);
    output = Buffer.from(rewriteText(text));
  }
  await writeAsset(remote, output);
}

async function mirrorRoutes() {
  for (const route of routes) {
    const url = `${origin}${route}`;
    console.log(`Fetching route ${route}`);
    const html = (await fetchBuffer(url)).toString("utf8");
    collectUrls(html);
    const file = routeFile(route);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
}

async function mirrorAssets() {
  for (let pass = 0; pass < maxResourcePasses && pendingAssets.length > 0; pass += 1) {
    const batch = pendingAssets.splice(0, pendingAssets.length);
    console.log(`Asset pass ${pass + 1}: ${batch.length} files`);
    for (let index = 0; index < batch.length; index += 1) {
      const remote = batch[index];
      try {
        await mirrorAsset(remote);
      } catch (error) {
        console.warn(`Failed asset: ${remote}`);
        console.warn(error.message);
      }
      if ((index + 1) % 20 === 0 || index + 1 === batch.length) {
        console.log(`  ${index + 1}/${batch.length}`);
      }
    }
  }
}

async function rewriteHtmlFiles() {
  for (const route of routes) {
    const file = routeFile(route);
    const html = await readFile(file, "utf8");
    await writeFile(file, rewriteText(html));
  }
}

async function main() {
  await rm(publicDir, { recursive: true, force: true });
  await mkdir(assetsDir, { recursive: true });

  await mirrorRoutes();
  await mirrorAssets();
  await rewriteHtmlFiles();

  const manifest = {
    origin,
    routes,
    assets: [...assetMap.entries()].map(([remote, local]) => ({ remote, local })),
  };
  await writeFile(path.join(publicDir, "mirror-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Done. Mirrored ${routes.length} routes and ${assetMap.size} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
