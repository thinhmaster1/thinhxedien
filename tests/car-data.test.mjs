import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CarSummary, CarSources } from "../js/detail-content.js";

const data = JSON.parse(readFileSync(new URL("../data/cars.json", import.meta.url), "utf8"));
assert.equal(data.cars.length, 12);
assert.equal(new Set(data.cars.map(car => car.slug)).size, 12);
for (const car of data.cars) {
  assert.equal(car.price, Math.min(...car.versions.map(version => version.price)), car.slug);
  assert.ok(car.summary.description && car.summary.audience && car.summary.charging, car.slug);
  assert.equal(car.summary.highlights.length, 3, car.slug);
  assert.ok(car.sources.length > 0 && car.sources.every(source => new URL(source.url).protocol === "https:"), car.slug);
  assert.ok(CarSummary(car).includes('id="overview"'), car.slug);
  assert.ok(CarSources(car).includes(car.specsUpdated), car.slug);
}
const bySlug = slug => data.cars.find(car => car.slug === slug);
assert.match(bySlug("ec-van").specs.range, /175/);
assert.match(bySlug("ec-van").specs.battery, /18,3/);
assert.match(bySlug("ec-van").specs.dcCharge, /24,2/);
assert.match(bySlug("ec-van").specsNote, /150/);
assert.match(bySlug("vf-2").specs.dcCharge, /34 phút/);
assert.equal(bySlug("vf-2").specs.trunk, undefined);
assert.equal(bySlug("vf-2").specs.acCharge, undefined);
assert.equal(bySlug("vf-2").specs.vehicleWarranty, "5 năm / 130.000 km");
assert.equal(bySlug("vf-2").specs.batteryWarranty, "7 năm / 160.000 km");
assert.deepEqual(
  Object.entries(bySlug("vf-2").colorPrices).filter(([, price]) => price === 0).map(([color]) => color),
  ["Trắng Infinity Blanc", "Đỏ Solar Ruby", "Bạc Desat Silver"]
);
assert.equal(Object.values(bySlug("vf-2").colorPrices).filter(price => price === 8000000).length, 5);
assert.match(bySlug("vf-2").colorNote, /màu cơ bản/);
assert.match(bySlug("vf-7").specs.battery, /70 kWh/);
assert.match(bySlug("vf-7").specsNote, /75,3/);
assert.match(bySlug("mpv-7").specs.parkingSupport, /Camera lùi/);
assert.match(bySlug("vf-8-moi").specs.vehicleWarranty, /7 năm/);
assert.match(bySlug("vf-8").specs.vehicleWarranty, /10 năm/);
const unsafe = { ...bySlug("vf-3"), name: '<img src=x onerror="alert(1)">', sources: [{ title: "Unsafe", url: "javascript:alert(1)" }] };
assert.ok(!CarSummary(unsafe).includes("<img src=x"));
assert.ok(!CarSources(unsafe).includes("javascript:"));
console.log("PASS: 12 model records, sourced corrections, summaries, warranties and HTML escaping.");
