import { display, esc, money, UPDATING } from "./core.js";

export function Header({ overlay = false } = {}) {
  return `<header class="site-header ${overlay ? "is-overlay" : ""}"><a class="brand" href="index.html" aria-label="Thịnh Xe Điện - Trang chủ"><span class="v-mark">T</span><span>Thịnh Xe Điện</span></a><nav aria-label="Điều hướng chính"><a href="index.html#models">Dòng xe</a><a href="compare.html">So sánh</a><a href="data.html">Dữ liệu</a><a href="policies.html">Ưu đãi T8</a><a href="quote.html">Báo giá</a></nav><button class="nav-cta" type="button" data-open-consultation>Đăng ký tư vấn</button><dialog class="consult-dialog" id="consult-dialog" aria-labelledby="consult-title"><form method="dialog" class="consult-form" id="consult-form"><button class="consult-close" type="button" data-close-consultation aria-label="Đóng">×</button><span>THỊNH XE ĐIỆN</span><h2 id="consult-title">Tư vấn & lái thử.</h2><p>Để lại thông tin, Bùi Đắc Thịnh sẽ liên hệ hỗ trợ bạn.</p><fieldset><legend>Nhu cầu của bạn</legend><div class="consult-choice"><label><input type="radio" name="requestType" value="Nhờ tư vấn" checked><b>Nhờ tư vấn</b></label><label><input type="radio" name="requestType" value="Đăng ký lái thử"><b>Đăng ký lái thử</b></label></div></fieldset><div class="consult-fields"><label><span>Họ và tên</span><input name="customerName" type="text" autocomplete="name" required placeholder="Nguyễn Văn A"></label><label><span>Số điện thoại</span><input name="customerPhone" type="tel" autocomplete="tel" inputmode="tel" required pattern="[0-9 +]{9,15}" placeholder="09xx xxx xxx"></label><label><span>Dòng xe quan tâm</span><select name="car"><option value="Chưa xác định">Chọn dòng xe</option><option>VF 2</option><option>VF 3</option><option>VF 5</option><option>VF 6</option><option>VF 7</option><option>VF 8</option><option>VF 8 Thế hệ mới</option><option>VF 9</option><option>Herio Green</option><option>Limo Green</option><option>VF MPV 7</option><option>EC Van</option></select></label><label><span>Khu vực</span><input name="location" type="text" autocomplete="address-level2" placeholder="Tỉnh / thành phố"></label><label class="consult-note"><span>Ghi chú</span><textarea name="note" rows="3" placeholder="Thời gian thuận tiện để liên hệ hoặc lái thử"></textarea></label></div><small>Thông tin chỉ được dùng để liên hệ tư vấn theo yêu cầu của bạn.</small><button class="consult-submit" type="submit">Gửi yêu cầu qua Zalo</button><p class="consult-status" id="consult-status" aria-live="polite"></p></form></dialog></header>`;
}

document.addEventListener("click", event => {
  const dialog = document.querySelector("#consult-dialog");
  if (event.target.closest("[data-open-consultation]")) {
    dialog?.showModal();
    setTimeout(() => dialog?.querySelector("input[name='customerName']")?.focus(), 50);
  }
  if (event.target.closest("[data-close-consultation]")) dialog?.close();
  if (event.target === dialog) dialog.close();
});

document.addEventListener("submit", event => {
  if (event.target.id !== "consult-form") return;
  event.preventDefault();
  const data = new FormData(event.target);
  const message = [`${data.get("requestType")} - Thịnh Xe Điện`, `Khách hàng: ${data.get("customerName")}`, `Số điện thoại: ${data.get("customerPhone")}`, `Dòng xe: ${data.get("car")}`, `Khu vực: ${data.get("location") || "Chưa cung cấp"}`, `Ghi chú: ${data.get("note") || "Không có"}`].join("\n");
  navigator.clipboard?.writeText(message).catch(() => {});
  window.open("https://zalo.me/0352978519", "_blank", "noopener");
  document.querySelector("#consult-status").textContent = "Đã sao chép nội dung. Hãy dán vào cửa sổ Zalo vừa mở để gửi yêu cầu.";
});

export function Footer() {
  return `<footer id="sources"><a class="brand" href="index.html"><span class="v-mark">T</span><span>Thịnh Xe Điện</span></a><p>Dữ liệu tổng hợp từ bảng thông số sản phẩm và chính sách bán hàng VinFast tại Việt Nam, cập nhật tháng 08/2026.</p><small>Trang tham khảo độc lập · Không phải website bán hàng chính thức</small></footer>`;
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
