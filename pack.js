const fs = require("fs");
const path = require("path");

const projectDir = process.argv[2];

if (!projectDir) {
  console.log("Usage: node pack.js <project-folder>");
  process.exit(1);
}

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
  "test-results",
]);

const EXCLUDED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".svg",
  ".pdf",
  ".zip",
  ".mp4",
  ".mp3",
]);

let output = [];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      if (EXCLUDED_DIRS.has(item.name)) continue;
      walk(fullPath);
      continue;
    }

    const ext = path.extname(item.name).toLowerCase();

    if (EXCLUDED_EXTENSIONS.has(ext)) continue;

    const relativePath = path.relative(projectDir, fullPath);

    try {
      const content = fs.readFileSync(fullPath, "utf8");

      output.push(
`===FILE_START===
PATH:${relativePath}
===CONTENT===
${content}