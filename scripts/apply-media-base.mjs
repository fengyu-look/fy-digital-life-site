import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { externalMediaAssets } from "./media-assets.mjs";

const rewriteExtensions = new Set([".css", ".html", ".js", ".json", ".mjs"]);

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function applyExternalMediaBase(distDir, rawMediaBaseUrl = process.env.MEDIA_BASE_URL) {
  if (!rawMediaBaseUrl) return { enabled: false, removed: 0, rewrittenFiles: 0 };

  const mediaBaseUrl = rawMediaBaseUrl.replace(/\/+$/, "");
  const replacements = externalMediaAssets.map((assetPath) => ({
    assetPath,
    pattern: new RegExp(escapeRegExp(`/${assetPath}`), "g"),
    url: `${mediaBaseUrl}/${assetPath}`,
  }));

  const files = await walk(distDir);
  let rewrittenFiles = 0;

  for (const file of files) {
    if (!rewriteExtensions.has(path.extname(file).toLowerCase())) continue;

    const original = await readFile(file, "utf8");
    let next = original;
    for (const replacement of replacements) {
      next = next.replace(replacement.pattern, replacement.url);
    }

    if (next !== original) {
      await writeFile(file, next);
      rewrittenFiles += 1;
    }
  }

  let removed = 0;
  for (const assetPath of externalMediaAssets) {
    const localPath = path.join(distDir, assetPath);
    try {
      const info = await stat(localPath);
      if (!info.isFile()) continue;
      await rm(localPath);
      removed += 1;
    } catch {}
  }

  return { enabled: true, removed, rewrittenFiles };
}
