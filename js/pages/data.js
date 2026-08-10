import { esc, fail, money, UPDATING } from "../core.js";
import { Footer, Header } from "../components.js";

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

fetch("data/cars.json").then(response => {
  if (!response.ok) throw new Error("Không thể tải dữ liệu giá xe");
  return response.json();
}).then(data => {
  const models = [...data.cars, ...(data.additionalPrices || [])];
  const rows = models.flatMap(car => car.versions.map((version, index) => ({ car, version, first: index === 0 })));
  document.querySelector("#price-meta").textContent = `${models.length} dòng xe · ${rows.length} phiên bản · Cập nhật ${data.updated}`;
  document.querySelector("#price-table-body").innerHTML = rows.map(({ car, version, first }) => `<tr class="${first ? "car-start" : ""}"><td>${first ? `${car.slug ? `<a href="detail.html?xe=${car.slug}">` : `<span>`}<strong>${esc(car.name)}</strong><span>${esc(car.use)}</span>${car.slug ? `</a>` : `</span>`}` : ""}</td><td>${first ? esc(car.segment) : ""}</td><td>${esc(version.name)}</td><td class="price-cell ${version.price ? "" : "is-updating"}">${version.price ? money(version.price) : UPDATING}</td><td class="${car.specs?.range ? "" : "is-updating"}">${first ? (car.specs?.range || UPDATING) : ""}</td><td class="${car.specs?.seats ? "" : "is-updating"}">${first ? (car.specs?.seats || UPDATING) : ""}</td></tr>`).join("");
}).catch(fail);
