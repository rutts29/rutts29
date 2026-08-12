import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const maxFileBytes = 2 * 1024 * 1024;

const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
const stagedOnly = process.argv.includes("--staged");
const listedFiles = execFileSync(
  "git",
  stagedOnly
    ? ["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMR"]
    : ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { cwd: repositoryRoot },
)
  .toString("utf8")
  .split("\0")
  .filter(Boolean);

const forbiddenExtensions = new Set([
  ".jks",
  ".key",
  ".keystore",
  ".p12",
  ".pem",
  ".pfx",
]);
const secretPatterns = [
  ["private key", /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["OpenAI-style key", /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
];

const findings = [];

for (const file of listedFiles) {
  const fileName = basename(file).toLowerCase();
  const isEnvironmentFile =
    (fileName === ".env" || fileName.startsWith(".env.")) &&
    !fileName.endsWith(".example");

  if (isEnvironmentFile) {
    findings.push(`${file}: environment file`);
    continue;
  }

  if (forbiddenExtensions.has(extname(fileName))) {
    findings.push(`${file}: key or certificate file`);
    continue;
  }

  let content;
  try {
    if (stagedOnly) {
      const stagedSize = Number(
        execFileSync("git", ["cat-file", "-s", `:${file}`], {
          cwd: repositoryRoot,
          encoding: "utf8",
        }).trim(),
      );
      if (!Number.isSafeInteger(stagedSize) || stagedSize > maxFileBytes) {
        findings.push(`${file}: exceeds the 2 MiB scan limit`);
        continue;
      }
      content = execFileSync("git", ["show", `:${file}`], {
        cwd: repositoryRoot,
        maxBuffer: maxFileBytes,
      });
    } else {
      const path = resolve(repositoryRoot, file);
      let stat;
      try {
        stat = lstatSync(path);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
          continue;
        }
        throw error;
      }
      if (!stat.isFile()) continue;
      if (stat.size > maxFileBytes) {
        findings.push(`${file}: exceeds the 2 MiB scan limit`);
        continue;
      }
      content = readFileSync(path);
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message.split("\n", 1)[0] : "unknown error";
    findings.push(`${file}: could not be scanned (${reason})`);
    continue;
  }

  if (content.includes(0)) continue;
  const text = content.toString("utf8");

  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(text)) findings.push(`${file}: possible ${label}`);
  }
}

if (findings.length > 0) {
  console.error("Repository hygiene check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(
  stagedOnly
    ? "Staged files passed the repository hygiene check."
    : "Repository files passed the hygiene check.",
);
