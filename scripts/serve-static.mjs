// Tiny dependency-free static server for the exported site in `out/`.
// Used by `npm start` and "Start Portfolio.cmd". Render serves `out/` itself in production.
//   node scripts/serve-static.mjs            -> http://localhost:3100
//   node scripts/serve-static.mjs -p 4000    -> http://localhost:4000

import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../out", import.meta.url)));
const flag = process.argv.indexOf("-p");
const port = Number(flag > -1 ? process.argv[flag + 1] : process.env.PORT || 3100);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

if (!existsSync(join(root, "index.html"))) {
  console.error("No exported site found in out/. Run `npm run build` first.");
  process.exit(1);
}

function resolveFile(urlPath) {
  let p;
  try {
    p = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  } catch {
    return null;
  }
  const file = normalize(join(root, p));
  if (file !== root && !file.startsWith(root + sep)) return null; // no escaping out/
  const candidates = [file, join(file, "index.html"), `${file}.html`];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  let file = resolveFile(req.url || "/");
  let status = 200;
  if (!file) {
    file = existsSync(join(root, "404.html")) ? join(root, "404.html") : null;
    status = 404;
  }
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    return;
  }
  const headers = {
    "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
    "Content-Length": statSync(file).size,
    "Cache-Control": file.includes(`${sep}_next${sep}static${sep}`) ? "public, max-age=31536000, immutable" : "no-cache",
  };
  res.writeHead(status, headers);
  if (req.method === "HEAD") res.end();
  else createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`Portfolio running at http://localhost:${port}  (Ctrl+C or close this window to stop)`);
});
