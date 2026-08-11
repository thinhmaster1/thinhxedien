import { fail, loadCars, money, param, specGroups } from "../core.js";
import { Footer, Header, MetricCard, SpecAccordion, VehicleCard } from "../components.js";

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

const COLOR_TONES = [
  ["Infinity Blanc", "#f4f2ec"], ["Jet Black", "#1c1c1f"],
  ["Zenith Grey", "#777b80"], ["Stealth Gray", "#55575b"],
  ["Desat Silver", "#b9bcc0"], ["Solar Ruby", "#a51f2b"],
  ["Crimson Velvet", "#801c2b"], ["Crimson Red", "#9e1724"],
  ["Urban Mint", "#82b7aa"], ["Tropical Jade", "#3b9577"],
  ["Ivy Green", "#294b3d"], ["Summer Yellow", "#f1ca32"],
  ["Sky Blue", "#73afd1"], ["Starburst Blue", "#31577d"],
  ["Starburst", "#31577d"], ["Moonlit Ocean", "#263d55"],
  ["Rose Pink", "#eaaab7"], ["Rose Metallic", "#c88991"],
  ["Vitality", "#df6b2d"], ["Mysterioso", "#493654"],
  ["Pebble Beige", "#c9b59b"], ["Introspective Brown", "#715245"],
  ["Mystery Bronze", "#796552"], ["Aqua Blue", "#4fa8b8"],
  ["Trắng", "#f4f2ec"], ["Đen", "#1c1c1f"], ["Bạc", "#b9bcc0"],
  ["Xám", "#777b80"], ["Đỏ", "#a51f2b"], ["Vàng", "#f1ca32"],
  ["Xanh", "#4f8e83"], ["Hồng", "#d99aa8"], ["Tím", "#493654"],
  ["Cam", "#df6b2d"], ["Đồng", "#796552"], ["Be", "#c9b59b"]
];

const colorTone = name => COLOR_TONES.find(([label]) => name.includes(label))?.[1] || "#a7a9ac";
const swatchStyle = name => {
  const [body, roof] = name.split(/\s*\+\s*nóc\s*/i);
  if (!roof) return colorTone(body);
  return `linear-gradient(135deg, ${colorTone(body)} 0 58%, ${colorTone(roof)} 58% 100%)`;
};
const colorPrice = (car, color) => {
  const fee = car.colorPrices?.[color];
  if (fee === 0) return "Tiêu chuẩn";
  return fee ? `Thêm ${money(fee)}` : "";
};

loadCars().then(cars => {
  const car = cars.find(item => item.slug === param("xe")) || cars[0];
  const related = cars.filter(item => item.slug !== car.slug && (item.category === car.category || item.use === car.use)).slice(0,3);
  document.title = `${car.name} — Thịnh Xe Điện`;
  document.querySelector("#detail-root").innerHTML = `
    <section class="product-intro"><div class="product-intro__copy"><span>${car.segment} · ${car.use}</span><h1>${car.name}</h1><p>${car.tagline}</p><strong>Giá từ ${money(car.price)}</strong><div class="hero-actions"><a class="blue-button" href="compare.html?xe=${car.slug}">So sánh xe</a><a href="#overview">Xem tổng quan <span>↓</span></a></div></div><div class="product-intro__visual"><img src="${car.image}" alt="${car.name}"></div></section>
    <section class="metric-band" id="overview">${MetricCard("Quãng đường",car.specs.range,"Mỗi lần sạc")}${MetricCard("Công suất",car.specs.power,"Hiệu suất tối đa")}${MetricCard("Dung lượng pin",car.specs.battery,"Theo phiên bản")}${MetricCard("Số chỗ",car.specs.seats,"Không gian sử dụng")}</section>
    <section class="story-section"><div><span>HIỆU SUẤT ĐIỆN</span><h2>${car.specs.range ? `Đi xa tới ${car.specs.range.replace(/.*-\s*/,"")}.` : "Sẵn sàng cho mọi hành trình."}</h2><p>Khả năng vận hành được tổng hợp trực tiếp từ tài liệu sản phẩm, giúp bạn đối chiếu từng phiên bản dễ dàng hơn.</p></div><div class="story-visual"><img src="${car.image}" alt="${car.name} trên đường"><div><span>Công suất</span><b>${car.specs.power || "Đang cập nhật"}</b></div></div></section>
    <section class="version-section"><div class="section-title"><span>PHIÊN BẢN & GIÁ</span><h2>Lựa chọn phù hợp<br>với bạn.</h2><p>Giá đã bao gồm VAT và pin, dữ liệu được rà soát tháng 08/2026. Xem trang Ưu đãi T8 để biết chính sách đang áp dụng.</p></div><div class="version-cards">${car.versions.map((version,index) => `<article><h3>${version.name}</h3><small>${index === 0 ? "Giá từ" : "Giá đề xuất"}</small><strong>${money(version.price)}</strong><a href="compare.html?xe=${car.slug}">Đưa vào so sánh <span>›</span></a></article>`).join("")}</div></section>
    <section class="color-section"><div class="section-title"><span>MÀU NGOẠI THẤT</span><h2>Màu sắc được công bố.</h2><p>${car.colorNote || "Phí màu được rà soát theo thông tin cập nhật tháng 08/2026."}</p></div><div class="swatches">${car.colors.length ? car.colors.map(color => `<div><i style="--swatch:${swatchStyle(color)}"></i><span>${color}${colorPrice(car,color) ? `<small>${colorPrice(car,color)}</small>` : ""}</span></div>`).join("") : `<p class="is-updating">Dữ liệu đang cập nhật</p>`}</div></section>
    <section class="spec-section"><div class="section-title"><span>THÔNG SỐ KỸ THUẬT</span><h2>Chi tiết, khi bạn cần.</h2><p>Chạm vào từng nhóm để xem thông tin. Giá trị có dấu “/” thể hiện khác biệt giữa các phiên bản.</p></div><div class="accordion-list">${specGroups.filter(group => group.title !== "Phiên bản & trang bị" || group.items.some(([,key]) => car.specs[key])).map((group,index) => SpecAccordion(group,car.specs,index,index === 0)).join("")}</div></section>
    <section class="related-section"><div class="section-title"><span>KHÁM PHÁ THÊM</span><h2>Những lựa chọn gần nhất.</h2></div><div class="related-grid">${related.map(car => VehicleCard(car)).join("")}</div></section>`;
}).catch(fail);
