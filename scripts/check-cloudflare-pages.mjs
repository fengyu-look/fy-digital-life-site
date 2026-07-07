import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { externalMediaAssets } from "./media-assets.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repo, "dist");
const maxAssetBytes = 25 * 1024 * 1024;
const expectedExternalMedia = new Set(externalMediaAssets);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
}

let files;
try {
  files = await walk(distDir);
} catch {
  throw new Error("dist/ does not exist. Run npm run build before npm run deploy:check.");
}

const oversized = [];
for (const file of files) {
  const info = await stat(file);
  if (info.size > maxAssetBytes) {
    oversized.push({
      relativePath: path.relative(distDir, file),
      size: info.size,
    });
  }
}

if (oversized.length) {
  console.error("Cloudflare Pages deploy check failed: assets over 25 MiB must be moved to object storage or compressed.");
  for (const item of oversized.sort((a, b) => b.size - a.size)) {
    console.error(`- ${item.relativePath} (${formatBytes(item.size)})`);
  }
  process.exit(1);
}

const missingExternalMedia = [];
for (const assetPath of expectedExternalMedia) {
  const localPath = path.join(distDir, assetPath);
  try {
    if ((await stat(localPath)).isFile()) missingExternalMedia.push(assetPath);
  } catch {}
}

if (missingExternalMedia.length && process.env.MEDIA_BASE_URL) {
  console.error("Cloudflare Pages deploy check failed: MEDIA_BASE_URL is set but these large media files are still local:");
  for (const assetPath of missingExternalMedia) console.error(`- ${assetPath}`);
  process.exit(1);
}

console.log(`Cloudflare Pages deploy check passed. ${files.length} files are within the 25 MiB asset limit.`);
