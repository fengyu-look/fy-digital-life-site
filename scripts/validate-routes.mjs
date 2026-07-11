import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  canonicalPages,
} from "./route-policy.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const obsoletePublicAssets = [
  "orbit-entry-fix.js",
  "prompt-entry-fix.js",
  "skill-entry-fix.js",
  "agent-entry-fix.js",
  "photography-entry-fix.js",
  "orbit-recommendations.css",
  "orbit-recommendations.js",
  "prompt-recommendations.css",
  "prompt-recommendations.js",
  "skill-recommendations.css",
  "skill-recommendations.js",
  "photography-showcase.css",
  "photography-showcase.js",
  "jarvaveckan-agent-guide.css",
  "jarvaveckan-agent-guide.js",
  "beerprice-photo-replacements.js",
];

const forbiddenPublicRoutes = [
  "about",
  "work",
  "orbit-mono",
  "a-swedish-cowboy",
  "wurst-price-scenario",
  "the-volatile-beerprice",
  "jarvaveckan",
  "studio/workbench",
  "ctrl-malt-keep",
  "concept-synth-studio",
  "concept-midi-mixer-wip",
];

async function exists(relativePath) {
  try {
    await stat(path.join(repo, relativePath));
    return true;
  } catch {
    return false;
  }
}

function routePattern(route) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`href=["'](?:${escaped}|\\.${escaped})/?(?:[?#][^"']*)?["']`, "i");
}

function collectPageIssues(page, html) {
  const issues = [];
  const htmlTagPattern = new RegExp(`data-page-id=["']${page.pageId}["']`);
  if (!htmlTagPattern.test(html)) {
    issues.push(`missing page id ${page.pageId}`);
  }

  if (!new RegExp(`<title>${page.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</title>`).test(html)) {
    issues.push(`title should be ${page.title}`);
  }

  if (!new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${page.route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(html)) {
    issues.push(`canonical should be ${page.route}`);
  }

  const bannedText = [
    /#archived-project/i,
    /data-site-archived/i,
    /\bGustaf\b/i,
    /Gustaf\s+Furusten/i,
    /gustaf[._-]furusten/i,
    /GULLERS/i,
    /A\s+SWEDISH\s+COWBOY/i,
    /WURST\s+PRICE\s+SCENARIO/i,
    /volatile\s+beerprice/i,
    /J[AÄ]RVAVECKAN/i,
    /Orbit\s+mono\s+font/i,
  ];

  for (const pattern of bannedText) {
    if (pattern.test(html)) issues.push(`contains retired text pattern ${pattern}`);
  }

  for (const route of forbiddenPublicRoutes.map((route) => `/${route}`)) {
    if (routePattern(route).test(html)) issues.push(`contains retired href ${route}`);
  }

  for (const asset of obsoletePublicAssets) {
    if (html.includes(`/assets/custom/${asset}`)) {
      issues.push(`loads obsolete custom asset ${asset}`);
    }
  }

  return issues;
}

export async function validateRoutes() {
  const failures = [];

  for (const page of canonicalPages) {
    const html = await readFile(path.join(repo, page.file), "utf8");
    const issues = collectPageIssues(page, html);
    if (issues.length) failures.push(`${page.file}: ${issues.join("; ")}`);
  }

  for (const route of forbiddenPublicRoutes) {
    const publicDir = path.join("public", route);
    if (await exists(publicDir)) failures.push(`${publicDir} must not exist in the new-site build`);
  }

  for (const asset of obsoletePublicAssets) {
    const publicAsset = path.join("public/assets/custom", asset);
    if (await exists(publicAsset)) failures.push(`${publicAsset} must be archived outside public/`);
  }

  if (failures.length) {
    throw new Error(`Route validation failed:\n- ${failures.join("\n- ")}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  validateRoutes()
    .then(() => console.log("Route validation passed."))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
