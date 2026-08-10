import { display, esc, money, UPDATING } from "./core.js";

export function Header({ overlay = false } = {}) {
  return `<header class="site-header ${overlay ? "is-overlay" : ""}"><a class="brand" href="index.html" aria-label="Thịnh Xe Điện - Trang chủ"><span class="v-mark">T</span><span>Thịnh Xe Điện</span></a><nav aria-label="Điều hướng chính"><a href="index.html#models">Dòng xe</a><a href="compare.html">So sánh</a><a href="data.html">Dữ liệu</a></nav><a class="nav-cta" href="compare.html">So sánh xe</a></header>`;
}

export function Footer() {
  return `<footer id="sources"><a class="brand" href="index.html"><span class="v-mark">T</span><span>Thịnh Xe Điện</span></a><p>Dữ liệu tổng hợp từ bảng thông số sản phẩm và chính sách giá VinFast tại Việt Nam, cập nhật tháng 07/2026.</p><small>Trang tham khảo độc lập · Không phải website bán hàng chính thức</small></footer>`;
}

export function VehicleCard(car, { large = false } = {}) {
  return `<article class="vehicle-card ${large ? "is-featured" : ""}"><div class="vehicle-card__copy"><span class="pill">${esc(car.segment)}</span><h3>${esc(car.name)}</h3><p>${esc(car.tagline)}</p><div class="vehicle-card__price"><span>Từ</span><strong>${money(car.price)}</strong></div><div class="card-actions"><a href="detail.html?xe=${car.slug}">Tìm hiểu thêm <span>›</span></a><a href="compare.html?xe=${car.slug}">So sánh <span>›</span></a></div></div><a class="vehicle-card__image" href="detail.html?xe=${car.slug}" aria-label="Xem ${esc(car.name)}"><img src="${car.image}" alt="${esc(car.name)}"></a></article>`;
}

export function CategorySection(group, index) {
  const feature = group.cars.find(car => car.featured) || group.cars[0];
  const rest = group.cars.filter(car => car.slug !== feature.slug);
  return `<section class="model-category ${index % 2 ? "tone-soft" : ""}"><div class="category-heading"><span>${esc(group.meta.eyebrow)}</span><h2>${esc(group.meta.title)}</h2><p>${esc(group.meta.description)}</p></div><div class="category-grid ${rest.length === 0 ? "single" : ""}">${VehicleCard(feature, { large: true })}${rest.map(car => VehicleCard(car)).join("")}</div></section>`;
}

export function MetricCard(label, rawValue, note = "") {
  return `<article class="metric-card ${rawValue ? "" : "is-missing"}"><span>${esc(label)}</span><strong>${display(rawValue)}</strong>${note && rawValue ? `<small>${esc(note)}</small>` : ""}</article>`;
}

export function SpecAccordion(group, specs, index, open = false) {
  return `<details class="spec-accordion" ${open ? "open" : ""}><summary><h3>${esc(group.title)}</h3><i></i></summary><div class="spec-accordion__content">${group.items.map(([label,key]) => `<div><span>${esc(label)}</span><b class="${specs[key] ? "" : "is-updating"}">${display(specs[key])}</b></div>`).join("")}</div></details>`;
}

export function CarSelector(car, cars, index, selected) {
  return `<article class="selector-card"><div class="selector-card__image"><img src="${car.image}" alt="${esc(car.name)}"></div><label><span>MẪU XE</span><select data-selector="${index}" aria-label="Chọn xe thứ ${index + 1}">${cars.map(item => `<option value="${item.slug}" ${item.slug === car.slug ? "selected" : ""} ${selected.includes(item.slug) && item.slug !== car.slug ? "disabled" : ""}>${esc(item.name)}</option>`).join("")}</select></label><strong>${money(car.price)}</strong><button data-remove="${index}" aria-label="Xóa ${esc(car.name)}">Xóa</button></article>`;
}

export function CompareValue(rawValue, highlight = false) {
  return `<b class="${rawValue ? "" : "is-updating"} ${highlight ? "is-best" : ""}">${display(rawValue)}</b>`;
}

export function MissingNote() {
  return `<p class="data-note">Những mục chưa xuất hiện trong tài liệu nguồn được hiển thị là “${UPDATING}”. Thông số có thể khác nhau theo phiên bản.</p>`;
}
