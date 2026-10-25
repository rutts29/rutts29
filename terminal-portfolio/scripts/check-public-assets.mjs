import { readdir, readFile } from "node:fs/promises";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const patterns = [
  ["absolute local path", /(?:\/Users\/|\/home\/)[A-Za-z0-9_.-]+\//],
  ["internal build path", /\/(?:private\/(?:tmp|var)|vercel\/path\d+|var\/task)\//],
  ["Windows user path", /[A-Z]:\\+Users\\+/],
  ["private key", /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["API key", /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
  ["local resume configuration", /RESUME_PDF_LOCAL_PATH/],
];

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) yield* files(path);
    else if (entry.isFile()) yield path;
  }
}

const findings = [];
let checked = 0;
for (const directory of ["public/", ".next/static/", ".next/server/app/"]) {
  for await (const path of files(new URL(`../${directory}`, import.meta.url))) {
    // Server JS is not browser-delivered. Inspect only its prerendered responses.
    if (directory === ".next/server/app/" && !/\.(?:html|body)$/.test(path.pathname)) continue;
    const name = relative(root, fileURLToPath(path));
    if (path.pathname.endsWith(".map")) findings.push(`${name}: public source map`);
    const bytes = await readFile(path);
    if (bytes.includes(0)) continue;
    checked += 1;
    const text = bytes.toString("utf8");
    for (const [label, pattern] of patterns) {
      if (pattern.test(text)) findings.push(`${name}: ${label}`);
    }
  }
}

if (findings.length) {
  // Report the file and category, never the potentially sensitive matched value.
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log(`${checked} public assets passed the path and credential-pattern check.`);
