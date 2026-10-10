import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";

const root = fileURLToPath(new URL("../", import.meta.url));
const walk = dir => readdirSync(dir,{ withFileTypes:true }).flatMap(entry => {
  if (entry.name.startsWith(".") || entry.name === "node_modules") return [];
  const path = resolve(dir,entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});
const files = walk(root);
const rootHtmlFiles = files.filter(path => dirname(path) === root.slice(0,-1) && extname(path) === ".html");
const verificationFiles = rootHtmlFiles.filter(path => /^google[a-f0-9]+\.html$/.test(relative(root,path)));
const pages = rootHtmlFiles.filter(path => !verificationFiles.includes(path));
assert.ok(pages.length >= 8,"Main HTML pages missing");

// Google verification files deliberately contain a token, not a full HTML document.
for (const path of verificationFiles) {
  const filename = relative(root,path);
  assert.equal(readFileSync(path,"utf8").trim(), `google-site-verification: ${filename}`, `Invalid Google verification file: ${filename}`);
}

function checkReference(from, reference) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return;
  const path = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!path) return;
  const target = resolve(path.startsWith("/") ? root : dirname(from),path.replace(/^\//,""));
  assert.ok(target.startsWith(root),`Reference outside site: ${reference}`);
  assert.ok(existsSync(target),`${relative(root,from)} -> missing ${reference}`);
}

for (const page of pages) {
  const html = readFileSync(page,"utf8");
  assert.match(html,/<html\b[^>]*lang=["']vi["']/i,relative(root,page));
  assert.match(html,/<meta\b[^>]*name=["']viewport["']/i,relative(root,page));
  assert.match(html,/<title>[^<]+<\/title>/i,relative(root,page));
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) checkReference(page,match[1]);
}
for (const path of files.filter(path => extname(path) === ".js")) {
  const result = spawnSync(process.execPath,["--check",path],{ encoding:"utf8" });
  assert.equal(result.status,0,result.stderr);
  const source = readFileSync(path,"utf8");
  for (const match of source.matchAll(/\b(?:from\s*|import\s*)["']([^"']+)["']/g)) checkReference(path,match[1]);
}
const cars = JSON.parse(readFileSync(resolve(root,"data/cars.json"),"utf8")).cars;
for (const car of cars) {
  for (const key of ["image","detailImage"]) checkReference(resolve(root,"index.html"),car[key]);
}

// Verify actual HTTP responses, including resources requested by HTML pages.
const server = createServer((req,res) => {
  const url = new URL(req.url,"http://localhost");
  const path = resolve(root,"." + decodeURIComponent(url.pathname));
  if (!path.startsWith(root) || !existsSync(path)) { res.writeHead(404).end(); return; }
  res.setHeader("Content-Type",extname(path) === ".json" ? "application/json" : "text/plain");
  res.end(readFileSync(path));
});
await new Promise((resolve,reject) => { server.once("error",reject); server.listen(0,"127.0.0.1",resolve); });
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of verificationFiles) {
    const filename = relative(root,path);
    const response = await fetch(`${base}/${filename}`);
    assert.equal(response.status,200,filename);
    assert.equal((await response.text()).trim(), `google-site-verification: ${filename}`);
  }
  for (const page of pages) {
    const response = await fetch(`${base}/${relative(root,page)}`);
    assert.equal(response.status,200);
    const html = await response.text();
    for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(match[1])) continue;
      const resource = await fetch(new URL(match[1],response.url));
      assert.equal(resource.status,200,`${response.url} -> ${match[1]}`);
      await resource.arrayBuffer();
    }
  }
  for (const filename of ["cars","promotions"]) {
    const response = await fetch(`${base}/data/${filename}.json`);
    assert.equal(response.status,200);
    assert.ok(await response.json());
  }
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
console.log(`PASS: ${pages.length} pages, ${verificationFiles.length} Google verification files, local links/assets, JavaScript syntax/imports and HTTP responses.`);
