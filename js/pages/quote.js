import { esc, fail, formatMoneyInput, loadCars, money, moneyInputValue } from "../core.js";
import { applySeo, Footer, Header } from "../components.js";

applySeo({ title: "Lập báo giá VinFast | Thịnh Xe Điện", canonical: "https://thinhxedien.com/quote.html" });
let robotsMeta = document.head.querySelector('meta[name="robots"]');
if (!robotsMeta) {
  robotsMeta = document.createElement("meta");
  robotsMeta.name = "robots";
  document.head.appendChild(robotsMeta);
}
robotsMeta.content = "noindex,nofollow";

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

const FEES = {
  registration: { province: 140000, city: 14000000 },
  inspection: 95000,
  road: { white: 1560000, yellow: 2160000 },
  liability: { white5: 846000, yellow5: 800000, white7: 941000, yellow7: 1200000 },
  physicalRate: { white: .012, yellow: .016 }
};
const SALES_PHONE = "0352 978 519";
const SALES_ADVISOR = "Bùi Đắc Thịnh";

const feeRow = (label, value, note = "") => `<div><span>${esc(label)}${note ? `<small>${esc(note)}</small>` : ""}</span><b>${money(value)}</b></div>`;

Promise.all([loadCars(), fetch("data/promotions.json").then(response => {
  if (!response.ok) throw new Error("Không thể tải dữ liệu khuyến mãi");
  return response.json();
})]).then(([cars,promotions]) => {
  const quoteCars = [...cars].sort((a,b) => a.price - b.price);
  const root = document.querySelector("#quote-root");
  root.innerHTML = `<section class="quote-hero"><span>CÔNG CỤ BÁO GIÁ</span><h1>Báo giá rõ ràng.<br>Chọn xe thật nhanh.</h1><p>Chọn xe, phiên bản, màu sắc và thông tin đăng ký để xem ngay chi phí dự kiến theo hai phương thức thanh toán.</p></section>
    <section class="quote-workspace"><form class="quote-form" id="quote-form">
      <div class="quote-form__heading"><span>THÔNG TIN BÁO GIÁ</span><h2>Lựa chọn của khách hàng</h2></div>
      <div class="customer-fields"><label><span>Tên khách hàng <small>Không bắt buộc</small></span><input id="customer-name" type="text" placeholder="Nhập tên khách hàng"></label><label><span>Số điện thoại <small>Không bắt buộc</small></span><input id="customer-phone" type="tel" placeholder="Nhập số điện thoại"></label></div>
      <fieldset><legend>Xe và phiên bản</legend><div class="form-grid"><label><span>Dòng xe · xếp theo giá tăng dần</span><select id="car-select">${quoteCars.map(car => `<option value="${car.slug}">${esc(car.name)}</option>`).join("")}</select></label><label><span>Phiên bản</span><select id="version-select"></select></label></div><label><span>Màu ngoại thất</span><select id="color-select"></select></label></fieldset>
      <fieldset><legend>Ưu đãi áp dụng</legend><div class="quote-promotion-group"><span>Ưu đãi theo dòng xe</span><div class="promotion-options" id="model-promotions"></div></div><label><span>Ưu đãi theo khách hàng</span><select id="customer-promotion"><option value="">Không áp dụng</option>${promotions.quoteOptions.customer.map(item => `<option value="${esc(item.id)}">${esc(item.label)}</option>`).join("")}</select></label><label><span>Ưu đãi VinClub <small>Không áp dụng cùng QĐ hoặc VNPost</small></span><select id="vinclub-promotion"><option value="">Không áp dụng</option>${promotions.quoteOptions.vinclub.map(item => `<option value="${esc(item.id)}">${esc(item.label)}</option>`).join("")}</select></label><label><span>Giảm giá thêm <small>Có thể bỏ trống</small></span><div class="money-input"><input id="discount" type="text" inputmode="numeric" placeholder="0"><i>₫</i></div></label><p class="promotion-help" id="promotion-help">${esc(promotions.quoteOptions.note)}</p></fieldset>
      <fieldset><legend>Đăng ký và sử dụng</legend><div class="choice-group"><span>Khu vực đăng ký biển</span><div><label><input type="radio" name="registration" value="province" checked><b>Tỉnh</b><small>140.000 ₫</small></label><label><input type="radio" name="registration" value="city"><b>Thành phố</b><small>14.000.000 ₫</small></label></div></div><div class="choice-group"><span>Loại biển số</span><div><label><input type="radio" name="plate" value="white" checked><b>Biển trắng</b><small>Xe cá nhân</small></label><label><input type="radio" name="plate" value="yellow"><b>Biển vàng</b><small>Xe kinh doanh</small></label></div></div><label class="check-option"><input id="physical-cash" type="checkbox"><span><b>Thêm bảo hiểm vật chất cho thanh toán tiền mặt</b><small>Không bắt buộc khi mua tiền mặt. Phương án vay luôn bắt buộc.</small></span></label></fieldset>
    </form><aside class="quote-results" id="quote-results"></aside></section>`;

  const form = document.querySelector("#quote-form");
  const carSelect = document.querySelector("#car-select");
  const versionSelect = document.querySelector("#version-select");
  const colorSelect = document.querySelector("#color-select");
  const modelPromotionsRoot = document.querySelector("#model-promotions");
  const customerPromotionSelect = document.querySelector("#customer-promotion");
  const vinclubPromotionSelect = document.querySelector("#vinclub-promotion");
  const promotionHelp = document.querySelector("#promotion-help");
  const discountInput = document.querySelector("#discount");

  const selectedCar = () => quoteCars.find(car => car.slug === carSelect.value) || quoteCars[0];

  function syncPromotionRules() {
    const customerPromotion = promotions.quoteOptions.customer.find(item => item.id === customerPromotionSelect.value);
    const excludesVinClub = customerPromotion?.excludes?.includes("vinclub");
    if (excludesVinClub) vinclubPromotionSelect.value = "";
    vinclubPromotionSelect.disabled = Boolean(excludesVinClub);
    promotionHelp.textContent = excludesVinClub
      ? "Ưu đãi Công an & Quân đội hoặc VNPost không được áp dụng đồng thời với VinClub. VinClub đã được tắt."
      : promotions.quoteOptions.note;
  }

  function updateOptions() {
    const car = selectedCar();
    versionSelect.innerHTML = car.versions.map((version,index) => `<option value="${index}">${esc(version.name)} — ${money(version.price)}</option>`).join("");
    colorSelect.innerHTML = car.colors.map(color => { const fee = car.colorPrices?.[color] || 0; return `<option value="${esc(color)}">${esc(color)}${fee ? ` — thêm ${money(fee)}` : " — tiêu chuẩn"}</option>`; }).join("");
    const applicable = promotions.quoteOptions.model.filter(item => item.carSlugs.includes(car.slug));
    modelPromotionsRoot.innerHTML = applicable.length ? applicable.map(item => `<label><input type="checkbox" name="modelPromotion" value="${esc(item.id)}"><span><b>${esc(item.label)}</b><small>${esc(item.note || "Theo chính sách hiện hành")}</small></span></label>`).join("") : `<p>Chưa có ưu đãi riêng cho dòng xe này.</p>`;
  }

  function calculate() {
    const car = selectedCar();
    const version = car.versions[Number(versionSelect.value) || 0];
    const color = colorSelect.value || car.colors[0];
    const listPrice = version.price;
    const selectedPromotionIds = [...form.querySelectorAll('[name="modelPromotion"]:checked')].map(input => input.value);
    const modelPromotions = promotions.quoteOptions.model.filter(item => selectedPromotionIds.includes(item.id));
    const customerPromotion = promotions.quoteOptions.customer.find(item => item.id === customerPromotionSelect.value);
    const vinclubPromotion = promotions.quoteOptions.vinclub.find(item => item.id === vinclubPromotionSelect.value);
    const modelDiscount = Math.min(modelPromotions.filter(item => item.type === "fixed").reduce((total,item) => total + item.value,0),listPrice);
    const customerBase = customerPromotion?.base === "afterModel" ? Math.max(0,listPrice - modelDiscount) : listPrice;
    const requestedCustomerDiscount = customerPromotion?.type === "percent" ? customerBase * customerPromotion.value : customerPromotion?.type === "fixed" ? customerPromotion.value : 0;
    const customerDiscount = Math.min(requestedCustomerDiscount,Math.max(0,listPrice - modelDiscount));
    const vinclubBase = vinclubPromotion?.base === "afterModel" ? Math.max(0,listPrice - modelDiscount) : listPrice;
    const requestedVinclubDiscount = vinclubPromotion?.type === "percent" ? vinclubBase * vinclubPromotion.value : vinclubPromotion?.type === "fixed" ? vinclubPromotion.value : 0;
    const vinclubDiscount = Math.min(requestedVinclubDiscount,Math.max(0,listPrice - modelDiscount - customerDiscount));
    const manualDiscount = Math.min(moneyInputValue(discountInput.value),Math.max(0,listPrice - modelDiscount - customerDiscount - vinclubDiscount));
    const discount = modelDiscount + customerDiscount + vinclubDiscount + manualDiscount;
    const colorFee = car.colorPrices?.[color] || 0;
    const vehicleValue = Math.max(0, listPrice - discount + colorFee);
    const registrationType = form.elements.registration.value;
    const plate = form.elements.plate.value;
    const sevenSeats = /(?:6\s*\/\s*7|7)\s*chỗ/i.test(car.specs.seats || "");
    const registration = FEES.registration[registrationType];
    const road = FEES.road[plate];
    const liability = FEES.liability[`${plate}${sevenSeats ? 7 : 5}`];
    const physical = Math.round(listPrice * FEES.physicalRate[plate]);
    const fixedFees = registration + FEES.inspection + road + liability;
    const cashPhysical = document.querySelector("#physical-cash").checked ? physical : 0;
    const cashTotal = vehicleValue + fixedFees + cashPhysical;
    const downPayment = Math.round(vehicleValue * .15);
    const loanTotal = downPayment + fixedFees + physical;
    const remainingLoan = vehicleValue - downPayment;
    const customer = document.querySelector("#customer-name").value.trim();
    const customerPhone = document.querySelector("#customer-phone").value.trim();

    document.querySelector("#quote-results").innerHTML = `<div class="quote-result-head"><div><span>BÁO GIÁ DỰ KIẾN</span><h2>${esc(car.name)}</h2><p>${esc(version.name)} · ${esc(color)}</p>${customer ? `<small>Khách hàng: ${esc(customer)}${customerPhone ? ` · ${esc(customerPhone)}` : ""}</small>` : customerPhone ? `<small>SĐT khách hàng: ${esc(customerPhone)}</small>` : ""}<a class="quote-contact" href="tel:0352978519"><span>Tư vấn bán hàng</span><b>${SALES_ADVISOR}</b><small>${SALES_PHONE}</small></a></div><div class="quote-actions"><button class="is-secondary" type="button" id="print-quote">In báo giá</button></div></div>
      <section class="vehicle-cost"><h3>Giá trị xe</h3>${feeRow("Giá niêm yết",listPrice)}${modelPromotions.filter(item => item.type === "fixed").map(item => feeRow("Ưu đãi dòng xe",-item.value,item.label)).join("")}${modelPromotions.filter(item => item.type === "gift").map(item => `<div class="promotion-gift"><span>${esc(item.label)}<small>${esc(item.note || "Quà tặng kèm")}</small></span><b>Tặng kèm</b></div>`).join("")}${customerPromotion ? feeRow("Ưu đãi khách hàng",-customerDiscount,customerPromotion.label) : ""}${vinclubPromotion ? feeRow("Ưu đãi VinClub",-vinclubDiscount,vinclubPromotion.label) : ""}${manualDiscount ? feeRow("Giảm giá thêm",-manualDiscount) : ""}${feeRow("Phụ phí màu",colorFee)}<div class="subtotal"><span>Giá xe sau ưu đãi</span><b>${money(vehicleValue)}</b></div></section>
      <div class="payment-results"><article class="payment-card cash"><span>THANH TOÁN TIỀN MẶT</span><h3>${money(cashTotal)}</h3><p>Tổng chi phí dự kiến để nhận xe.</p><div class="fee-breakdown">${feeRow("Giá xe",vehicleValue)}${feeRow("Đăng ký biển",registration,registrationType === "city" ? "Thành phố" : "Tỉnh")}${feeRow("Lệ phí đăng kiểm",FEES.inspection)}${feeRow("Bảo trì đường bộ",road,plate === "white" ? "Biển trắng" : "Biển vàng")}${feeRow("Bảo hiểm TNDS",liability,sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ")}${document.querySelector("#physical-cash").checked ? feeRow("Bảo hiểm vật chất",physical,`${FEES.physicalRate[plate] * 100}% giá niêm yết`) : ""}</div></article>
      <article class="payment-card loan"><span>THANH TOÁN VAY</span><h3>${money(loanTotal)}</h3><p>Khoản tiền dự kiến cần chuẩn bị ban đầu.</p><div class="fee-breakdown">${feeRow("Trả trước 15% giá trị xe",downPayment)}${feeRow("Đăng ký biển",registration,registrationType === "city" ? "Thành phố" : "Tỉnh")}${feeRow("Lệ phí đăng kiểm",FEES.inspection)}${feeRow("Bảo trì đường bộ",road,plate === "white" ? "Biển trắng" : "Biển vàng")}${feeRow("Bảo hiểm TNDS",liability,sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ")}${feeRow("Bảo hiểm vật chất bắt buộc",physical,`${FEES.physicalRate[plate] * 100}% giá niêm yết`)}</div><div class="loan-note"><span>Dư nợ dự kiến 85%</span><b>${money(remainingLoan)}</b><small>Chưa bao gồm lãi vay ngân hàng.</small><a href="loan.html?amount=${Math.ceil(remainingLoan)}">Tính lãi và lịch trả góp <span>›</span></a></div></article></div>
      <p class="quote-disclaimer">Báo giá mang tính tham khảo theo dữ liệu hiện có. Chi phí thực tế có thể thay đổi theo thời điểm, địa phương, ngân hàng và chính sách bán hàng.</p>`;
    document.querySelector("#print-quote").addEventListener("click", () => window.print());
  }

  carSelect.addEventListener("change", () => { updateOptions(); calculate(); });
  customerPromotionSelect.addEventListener("change", syncPromotionRules);
  discountInput.addEventListener("input", () => formatMoneyInput(discountInput));
  form.addEventListener("input", calculate);
  form.addEventListener("change", calculate);
  updateOptions();
  syncPromotionRules();
  calculate();
}).catch(fail);
