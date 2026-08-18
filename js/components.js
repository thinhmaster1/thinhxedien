import { display, esc, money, UPDATING } from "./core.js";

const SITE_URL = "https://thinhxedien.com";
const ensureMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith("meta") ? "meta" : "link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key,value]) => element.setAttribute(key,value));
};

export function applySeo({ title = document.title, description, canonical, image = `${SITE_URL}/public/cars/thumb-vf8-new.png`, type = "website" } = {}) {
  document.title = title;
  const pageUrl = canonical || `${SITE_URL}${location.pathname === "/" ? "/index.html" : location.pathname}`;
  if (description) ensureMeta('meta[name="description"]', { name: "description", content: description });
  ensureMeta('link[rel="canonical"]', { rel: "canonical", href: pageUrl });
  ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
  ensureMeta('meta[property="og:description"]', { property: "og:description", content: description || "Tư vấn xe điện VinFast tại Thủ Dầu Một và khu vực Bình Dương." });
  ensureMeta('meta[property="og:url"]', { property: "og:url", content: pageUrl });
  ensureMeta('meta[property="og:type"]', { property: "og:type", content: type });
  ensureMeta('meta[property="og:image"]', { property: "og:image", content: image });
};

applySeo();

export function Header({ overlay = false } = {}) {
  return `<header class="site-header ${overlay ? "is-overlay" : ""}"><a class="brand" href="index.html" aria-label="Thịnh Xe Điện - Trang chủ"><span class="v-mark">T</span><span>Thịnh Xe Điện</span></a><nav id="primary-navigation" aria-label="Điều hướng chính"><a href="index.html#models">Dòng xe</a><a href="vinfast-thu-dau-mot-binh-duong.html">Thủ Dầu Một</a><a href="compare.html">So sánh</a><a href="policies.html">Ưu đãi</a><a href="loan.html">Trả góp</a><a href="quote.html">Báo giá</a><button class="mobile-consult" type="button" data-open-consultation>Đăng ký tư vấn</button></nav><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Mở menu"><i></i><i></i></button><button class="nav-cta" type="button" data-open-consultation>Đăng ký tư vấn</button><dialog class="consult-dialog" id="consult-dialog" aria-labelledby="consult-title"><form method="dialog" class="consult-form" id="consult-form"><button class="consult-close" type="button" data-close-consultation aria-label="Đóng">×</button><span>THỊNH XE ĐIỆN</span><h2 id="consult-title">Tư vấn & lái thử.</h2><p>Để lại thông tin, Bùi Đắc Thịnh sẽ liên hệ hỗ trợ bạn.</p><a class="consult-direct" href="tel:0352978519"><span><small>TƯ VẤN TRỰC TIẾP</small><b>Gọi ngay 0352 978 519</b></span><i>Gọi ngay</i></a><div class="consult-divider"><span>hoặc để lại thông tin</span></div><fieldset><legend>Nhu cầu của bạn</legend><div class="consult-choice"><label><input type="radio" name="requestType" value="Nhờ tư vấn" checked><b>Nhờ tư vấn</b></label><label><input type="radio" name="requestType" value="Đăng ký lái thử"><b>Đăng ký lái thử</b></label></div></fieldset><div class="consult-fields"><label><span>Họ và tên</span><input name="customerName" type="text" autocomplete="name" required placeholder="Nguyễn Văn A"></label><label><span>Số điện thoại</span><input name="customerPhone" type="tel" autocomplete="tel" inputmode="tel" required pattern="[0-9 +]{9,15}" placeholder="09xx xxx xxx"></label><label><span>Dòng xe quan tâm</span><select name="car"><option value="Chưa xác định">Chọn dòng xe</option><option>VF 2</option><option>VF 3</option><option>VF 5</option><option>VF 6</option><option>VF 7</option><option>VF 8</option><option>VF 8 Thế hệ mới</option><option>VF 9</option><option>Herio Green</option><option>Limo Green</option><option>VF MPV 7</option><option>EC Van</option></select></label><label><span>Khu vực</span><input name="location" type="text" autocomplete="address-level2" placeholder="Tỉnh / thành phố"></label><label class="consult-note"><span>Ghi chú</span><textarea name="note" rows="3" placeholder="Thời gian thuận tiện để liên hệ hoặc lái thử"></textarea></label></div><small>Để bảo đảm an toàn thông tin khách hàng, yêu cầu sẽ được gửi trực tiếp qua Zalo tới Bùi Đắc Thịnh. Website không lưu trữ thông tin bạn đã nhập.</small><button class="consult-submit" type="submit">Gửi trực tiếp qua Zalo</button><p class="consult-status" id="consult-status" aria-live="polite"></p></form></dialog></header>`;
}

document.addEventListener("click", event => {
  const dialog = document.querySelector("#consult-dialog");
  const header = document.querySelector(".site-header");
  const toggle = event.target.closest("[data-toggle-navigation],.nav-toggle");
  if (toggle) {
    const open = !header.classList.contains("nav-open");
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  } else if (!event.target.closest(".site-header") || event.target.closest("#primary-navigation a")) {
    header?.classList.remove("nav-open");
    header?.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
  }
  if (event.target.closest("[data-open-consultation]")) {
    header?.classList.remove("nav-open");
    header?.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
    dialog?.showModal();
    setTimeout(() => dialog?.querySelector("input[name='customerName']")?.focus(), 50);
  }
  if (event.target.closest("[data-close-consultation]")) dialog?.close();
  if (event.target === dialog) dialog.close();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  const header = document.querySelector(".site-header");
  header?.classList.remove("nav-open");
  header?.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
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
  return `<footer class="site-footer" id="sources"><div class="site-footer__cta"><div><span>TƯ VẤN VINFAST TẠI BÌNH DƯƠNG</span><h2>Cùng bạn chọn chiếc xe phù hợp.</h2></div><div><a class="footer-call" href="tel:0352978519">Gọi 0352 978 519</a><a class="footer-map" href="https://maps.app.goo.gl/Vfy727dxQVM3tTcp6" target="_blank" rel="noopener">Chỉ đường <span>↗</span></a></div></div><div class="site-footer__main"><div class="site-footer__brand"><a class="brand" href="index.html"><span class="v-mark">T</span><span>Thịnh Xe Điện</span></a><p>Thông tin xe, phiên bản, giá và ưu đãi VinFast được trình bày rõ ràng, dễ tham khảo.</p></div><div class="site-footer__column"><span>SHOWROOM</span><h3>VinFast Bình Thủy<br>Thủ Dầu Một</h3><p>645 Đại lộ Bình Dương<br>08:00–19:00 mỗi ngày</p></div><nav class="site-footer__column" aria-label="Khám phá"><span>KHÁM PHÁ</span><a href="index.html#models">Các dòng xe</a><a href="compare.html">So sánh xe</a><a href="data.html">Bảng giá</a><a href="loan.html">Tính trả góp</a><a href="policies.html">Khuyến mãi</a></nav><nav class="site-footer__column" aria-label="Kết nối"><span>KẾT NỐI</span><a href="https://www.facebook.com/profile.php?id=61593225476616" target="_blank" rel="noopener">Facebook</a><a href="https://www.tiktok.com/@bui.dac.thinh" target="_blank" rel="noopener">TikTok</a><a href="vinfast-thu-dau-mot-binh-duong.html">Thông tin showroom</a></nav></div><div class="site-footer__bottom"><small>© 2026 Thịnh Xe Điện</small><small>Tư vấn viên tại showroom · Không phải website VinFast chính thức</small></div></footer>`;
}

export function VehicleCard(car, { large = false } = {}) {
  return `<article class="vehicle-card ${large ? "is-featured" : ""}"><div class="vehicle-card__copy"><span class="pill">${esc(car.segment)}</span><h3>${esc(car.name)}</h3><p>${esc(car.tagline)}</p><div class="card-actions"><a href="detail.html?xe=${car.slug}">Tìm hiểu thêm <span>›</span></a><a href="compare.html?xe=${car.slug}">So sánh <span>›</span></a></div></div><a class="vehicle-card__image" href="detail.html?xe=${car.slug}" aria-label="Xem ${esc(car.name)}"><img src="${car.image}" alt="${esc(car.name)}"></a></article>`;
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
