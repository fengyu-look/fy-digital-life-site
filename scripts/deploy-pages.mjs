import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.cwd();
const publishRepo = "fengyu-look/fengyu-look.github.io";
const publishUrl = `https://github.com/${publishRepo}.git`;
const deployDir = "/tmp/fy-digital-life-pages";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? sourceRoot,
    env: options.env ?? process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function tryRun(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? sourceRoot,
    env: options.env ?? process.env,
    stdio: "inherit",
  });

  return result.status === 0;
}

function readEnvLocal() {
  const envPath = path.join(sourceRoot, ".env.local");
  if (!fs.existsSync(envPath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return index === -1 ? [line, ""] : [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function copyDirectory(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.cpSync(from, to, { recursive: true });
}

function emptyDirectoryExceptGit(directory) {
  if (!fs.existsSync(directory)) return;

  for (const entry of fs.readdirSync(directory)) {
    if (entry === ".git") continue;
    fs.rmSync(path.join(directory, entry), { recursive: true, force: true });
  }
}

const localEnv = readEnvLocal();
const mediaBaseUrl = process.env.MEDIA_BASE_URL || localEnv.MEDIA_BASE_URL;

if (!mediaBaseUrl) {
  console.error("Missing MEDIA_BASE_URL. Add it to .env.local or set it before running deploy:pages.");
  process.exit(1);
}

const buildEnv = {
  ...process.env,
  MEDIA_BASE_URL: mediaBaseUrl,
};

run("npm", ["run", "validate:routes"]);
run("npm", ["run", "build"], { env: buildEnv });
run("npm", ["run", "deploy:check"]);

if (fs.existsSync(path.join(deployDir, ".git"))) {
  if (tryRun("git", ["fetch", "origin", "main"], { cwd: deployDir })) {
    run("git", ["reset", "--hard", "origin/main"], { cwd: deployDir });
  } else {
    console.warn("Could not fetch the publish repo. Reusing the existing local publish checkout.");
  }
} else {
  fs.rmSync(deployDir, { recursive: true, force: true });
  run("git", ["clone", "--depth", "1", publishUrl, deployDir]);
}

emptyDirectoryExceptGit(deployDir);
copyDirectory(path.join(sourceRoot, "dist"), deployDir);

run("git", ["add", "-A"], { cwd: deployDir });
run("git", ["commit", "--allow-empty", "-m", "Deploy FY Digital Life site"], { cwd: deployDir });
run("git", ["push", "-u", "origin", "main"], { cwd: deployDir });

console.log("Published to https://fengyu-look.github.io/");
