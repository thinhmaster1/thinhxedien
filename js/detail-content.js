import { esc, money } from "./core.js?v=2026091503";

const sourceLink = source => {
  try {
    const url = new URL(source.url);
    if (url.protocol !== "https:") return "";
    return `<a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} <span aria-hidden="true">↗</span></a>`;
  } catch { return ""; }
};

export function CarSummary(car) {
  const summary = car.summary;
  if (!summary) return "";
  const storage = [car.specs.trunk,car.specs.cargoDimensions].filter(Boolean).join(" · ") || "Chưa có số liệu hãng công bố";
  const facts = [
    { label:"Giá xe từ", value:money(car.price) },
    { label:"Số chỗ", value:car.specs.seats },
    { label:"Dung lượng pin", value:car.specs.battery },
    { label:"Quãng đường công bố", value:car.specs.range },
    { label:"Kích thước D × R × C", value:car.specs.dimensions, wide:true },
    { label:"Khoang hành lý / hàng", value:storage },
    { label:"Sạc nhanh", value:summary.charging }
  ];
  return `<section class="car-summary-section" id="overview" aria-labelledby="car-summary-title"><div class="car-summary-heading"><div><span>TÓM TẮT XE</span><h2 id="car-summary-title">${esc(car.name)} trong một phút.</h2></div><a href="#technical-specs">Xem thông số đầy đủ <span aria-hidden="true">↓</span></a></div><p class="car-summary-description">${esc(summary.description)}</p><p class="car-summary-audience"><span>Gợi ý nhu cầu</span> ${esc(summary.audience)}</p><dl class="car-summary-facts">${facts.map(fact => `<div${fact.wide ? ` class="is-wide"` : ""}><dt>${esc(fact.label)}</dt><dd>${esc(fact.value || "Chưa có số liệu hãng công bố")}</dd></div>`).join("")}</dl><ul class="car-summary-highlights">${summary.highlights.slice(0,3).map(item => `<li>${esc(item)}</li>`).join("")}</ul><p class="car-summary-note">Quãng đường là số công bố theo chu trình thử nghiệm, không phải cam kết thực tế. Sạc 10–70% phụ thuộc trụ sạc và điều kiện pin. Dung lượng pin, khoang hành lý và trang bị có thể khác theo phiên bản.</p></section>`;
}

export function CarSources(car) {
  return `<aside class="car-source-note" aria-labelledby="car-source-title"><h3 id="car-source-title">Nguồn & lưu ý dữ liệu</h3><p>Rà soát thông số: ${esc(car.specsUpdated || "Đang cập nhật")}. Giá và ưu đãi được quản lý riêng theo dữ liệu bán hàng hiện có.</p>${car.specsNote ? `<p>${esc(car.specsNote)}</p>` : ""}<div class="car-source-links">${(car.sources || []).map(sourceLink).join("")}</div><p>Thông tin trên tóm lược từ nguồn công bố, không thay thế phiếu cấu hình hoặc sổ bảo hành của xe thực tế. Mục chưa có căn cứ được giữ là “Dữ liệu đang cập nhật”.</p></aside>`;
}
