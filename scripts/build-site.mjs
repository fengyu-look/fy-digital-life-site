import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyExternalMediaBase } from "./apply-media-base.mjs";
import { validateRoutes } from "./validate-routes.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(repo, "public");
const distDir = path.join(repo, "dist");

try {
  await stat(publicDir);
} catch {
  throw new Error("public/ does not exist. Run npm run import:legacy first.");
}

await validateRoutes();
await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });
const mediaResult = await applyExternalMediaBase(distDir);
console.log(`Built static site into ${distDir}`);
if (mediaResult.enabled) {
  console.log(`External media enabled: rewrote ${mediaResult.rewrittenFiles} files and removed ${mediaResult.removed} local large assets.`);
}
