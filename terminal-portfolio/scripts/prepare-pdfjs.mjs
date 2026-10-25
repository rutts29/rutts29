import { copyFile, mkdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packagePath = require.resolve("pdfjs-dist/package.json");
const { version } = JSON.parse(await readFile(packagePath, "utf8"));
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const destination = join(projectRoot, "public", "pdfjs", version);

// Serve the installed browser modules unchanged. Bundling PDF.js rewrites
// import.meta.url in its Node-only fallback to an absolute build-machine path.
await mkdir(destination, { recursive: true });
for (const name of ["pdf.min.mjs", "pdf.worker.min.mjs"]) {
  await copyFile(join(dirname(packagePath), "build", name), join(destination, name));
}
await copyFile(join(dirname(packagePath), "LICENSE"), join(destination, "LICENSE"));
console.log(`Prepared PDF.js ${version} browser assets.`);
