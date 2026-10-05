import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

for (const name of ["car-data","finance-calculators","website"]) {
  const result = spawnSync(process.execPath,[fileURLToPath(new URL(`./${name}.test.mjs`,import.meta.url))],{ stdio:"inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log("All website checks passed.");
