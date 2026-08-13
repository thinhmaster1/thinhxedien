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

const fuelSavingSection = car => `
  <section class="fuel-saving-section" id="fuel-saving">
    <div class="fuel-saving-heading">
      <div><span>CHI PHÍ VẬN HÀNH</span><h2>${car.name} tiết kiệm được bao nhiêu?</h2></div>
      <p>Ước tính chi phí năng lượng của ${car.name} so với một xe động cơ đốt trong có cùng nhu cầu di chuyển.</p>
    </div>
    <div class="fuel-calculator">
      <form class="fuel-form" id="fuel-form">
        <label><span>Quãng đường mỗi tháng</span><div><input id="monthly-distance" type="number" min="1" step="100" value="3000" inputmode="numeric"><b>km</b></div></label>
        <fieldset><legend>Loại nhiên liệu so sánh</legend><div class="fuel-toggle"><label><input type="radio" name="fuel" value="gasoline" checked><span>Xăng</span></label><label><input type="radio" name="fuel" value="diesel"><span>Dầu</span></label></div></fieldset>
        <label><span>Mức tiêu thụ nhiên liệu / 100 km</span><div><input id="fuel-consumption" type="number" min="0.1" step="0.1" value="8" inputmode="decimal"><b>lít</b></div></label>
        <div class="free-charge-note"><i>✓</i><p><strong>Miễn phí sạc V-Green</strong><small>Áp dụng trong thời gian chính sách đến 10/02/2029.</small></p></div>
      </form>
      <div class="fuel-results" aria-live="polite">
        <div class="fuel-result-main"><span>Lợi thế chi phí năng lượng của ${car.name}</span><strong id="saving-month">0 ₫</strong><small>Tiết kiệm ước tính mỗi tháng</small></div>
        <div class="fuel-result-grid">
          <article><span>Xe xăng/dầu mỗi tháng</span><b id="combustion-month">0 ₫</b></article>
          <article><span>${car.name} mỗi tháng</span><b>0 ₫</b><small>Trong thời gian miễn phí sạc</small></article>
          <article><span>Tiết kiệm mỗi năm</span><b id="saving-year">0 ₫</b></article>
          <article><span>Tiết kiệm tới 10/02/2029</span><b id="saving-total">0 ₫</b></article>
        </div>
      </div>
    </div>
    <p class="fuel-disclaimer">Giá tham chiếu từ VinFast ngày 06/08/2026: xăng E10 RON 95-III Vùng I 22.320 đ/lít; dầu diesel 0,001S-V Vùng I 29.640 đ/lít. Kết quả chỉ mang tính ước tính và thay đổi theo quãng đường, mức tiêu hao, giá nhiên liệu và chính sách sạc.</p>
  </section>`;

const initFuelCalculator = () => {
  const form = document.querySelector("#fuel-form");
  if (!form) return;
  const format = value => `${Math.round(value).toLocaleString("vi-VN")} ₫`;
  const monthsUntilFreeChargeEnds = Math.max(0, (new Date("2029-02-10") - new Date()) / (1000 * 60 * 60 * 24 * 30.4375));
  const update = () => {
    const distance = Math.max(0, Number(document.querySelector("#monthly-distance").value) || 0);
    const consumption = Math.max(0, Number(document.querySelector("#fuel-consumption").value) || 0);
    const fuel = form.querySelector('[name="fuel"]:checked').value;
    const fuelPrice = fuel === "diesel" ? 29640 : 22320;
    const monthlyCost = distance / 100 * consumption * fuelPrice;
    document.querySelector("#combustion-month").textContent = format(monthlyCost);
    document.querySelector("#saving-month").textContent = format(monthlyCost);
    document.querySelector("#saving-year").textContent = format(monthlyCost * 12);
    document.querySelector("#saving-total").textContent = format(monthlyCost * monthsUntilFreeChargeEnds);
  };
  form.addEventListener("input", update);
  update();
};

loadCars().then(cars => {
  const car = cars.find(item => item.slug === param("xe")) || cars[0];
  const related = cars.filter(item => item.slug !== car.slug && (item.category === car.category || item.use === car.use)).slice(0,3);
  document.title = `${car.name} — Thịnh Xe Điện`;
  document.querySelector("#detail-root").innerHTML = `
    <section class="product-intro"><div class="product-intro__copy"><span>${car.segment} · ${car.use}</span><h1>${car.name}</h1><p>${car.tagline}</p><strong>Giá từ ${money(car.price)}</strong><div class="hero-actions"><a class="blue-button" href="compare.html?xe=${car.slug}">So sánh xe</a><a href="#overview">Xem tổng quan <span>↓</span></a></div></div><div class="product-intro__visual"><img src="${car.image}" alt="${car.name}"></div></section>
    <section class="metric-band" id="overview">${MetricCard("Quãng đường",car.specs.range,"Mỗi lần sạc")}${MetricCard("Công suất",car.specs.power,"Hiệu suất tối đa")}${MetricCard("Dung lượng pin",car.specs.battery,"Theo phiên bản")}${MetricCard("Số chỗ",car.specs.seats,"Không gian sử dụng")}</section>
    <section class="story-section"><div><span>HIỆU SUẤT ĐIỆN</span><h2>${car.specs.range ? `Đi xa tới ${car.specs.range.replace(/.*-\s*/,"")}.` : "Sẵn sàng cho mọi hành trình."}</h2><p>Khả năng vận hành được tổng hợp trực tiếp từ tài liệu sản phẩm, giúp bạn đối chiếu từng phiên bản dễ dàng hơn.</p></div><div class="story-visual"><img src="${car.image}" alt="${car.name} trên đường"><div><span>Công suất</span><b>${car.specs.power || "Đang cập nhật"}</b></div></div></section>
    ${fuelSavingSection(car)}
    <section class="version-section"><div class="section-title"><span>PHIÊN BẢN & GIÁ</span><h2>Lựa chọn phù hợp<br>với bạn.</h2><p>Giá đã bao gồm VAT và pin, dữ liệu được rà soát tháng 08/2026. Xem trang Ưu đãi T8 để biết chính sách đang áp dụng.</p></div><div class="version-cards">${car.versions.map((version,index) => `<article><h3>${version.name}</h3><small>${index === 0 ? "Giá từ" : "Giá đề xuất"}</small><strong>${money(version.price)}</strong><a href="compare.html?xe=${car.slug}">Đưa vào so sánh <span>›</span></a></article>`).join("")}</div></section>
    <section class="color-section"><div class="section-title"><span>MÀU NGOẠI THẤT</span><h2>Màu sắc được công bố.</h2><p>${car.colorNote || "Phí màu được rà soát theo thông tin cập nhật tháng 08/2026."}</p></div><div class="swatches">${car.colors.length ? car.colors.map(color => `<div><i style="--swatch:${swatchStyle(color)}"></i><span>${color}${colorPrice(car,color) ? `<small>${colorPrice(car,color)}</small>` : ""}</span></div>`).join("") : `<p class="is-updating">Dữ liệu đang cập nhật</p>`}</div></section>
    <section class="spec-section"><div class="section-title"><span>THÔNG SỐ KỸ THUẬT</span><h2>Chi tiết, khi bạn cần.</h2><p>Chạm vào từng nhóm để xem thông tin. Giá trị có dấu “/” thể hiện khác biệt giữa các phiên bản.</p></div><div class="accordion-list">${specGroups.filter(group => group.title !== "Phiên bản & trang bị" || group.items.some(([,key]) => car.specs[key])).map((group,index) => SpecAccordion(group,car.specs,index,index === 0)).join("")}</div></section>
    <section class="related-section"><div class="section-title"><span>KHÁM PHÁ THÊM</span><h2>Những lựa chọn gần nhất.</h2></div><div class="related-grid">${related.map(car => VehicleCard(car)).join("")}</div></section>`;
  initFuelCalculator();
}).catch(fail);
