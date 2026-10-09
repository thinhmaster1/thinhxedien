import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const seo = spawnSync(process.execPath, ['scripts/generate-seo.mjs', '--check'], { stdio: 'inherit' });
if (seo.status !== 0) process.exit(seo.status || 1);

for (const name of ["car-data","finance-calculators","quote-validation","website"]) {
  const result = spawnSync(process.execPath,[fileURLToPath(new URL(`./${name}.test.mjs`,import.meta.url))],{ stdio:"inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log("All website checks passed.");
