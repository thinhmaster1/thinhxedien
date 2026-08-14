import { esc, fail, loadCars, money } from "../core.js";
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

const ACCESS_HASH = "f6bca1d9410f17cb033cce86877c077d28343888b1d105f26ebde9ff6ead3540";
const ACCESS_KEY = "thinh-xe-dien-quote-access";
const gate = document.querySelector("#quote-gate");
const gateForm = document.querySelector("#quote-gate-form");
const gateError = document.querySelector("#quote-gate-error");

const digest = async value => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

const unlockQuote = () => {
  sessionStorage.setItem(ACCESS_KEY, "granted");
  document.body.classList.remove("quote-locked");
  gate.hidden = true;
};

if (sessionStorage.getItem(ACCESS_KEY) === "granted") unlockQuote();

gateForm.addEventListener("submit", async event => {
  event.preventDefault();
  const input = document.querySelector("#quote-passcode");
  const valid = await digest(input.value) === ACCESS_HASH;
  if (valid) {
    unlockQuote();
    return;
  }
  gateError.textContent = "Passcode chưa đúng. Vui lòng thử lại.";
  input.value = "";
  input.focus();
});

const FEES = {
  registration: { province: 140000, city: 14000000 },
  inspection: 95000,
  road: { white: 1560000, yellow: 2160000 },
  liability: { white5: 846000, yellow5: 800000, white7: 941000, yellow7: 1200000 },
  physicalRate: { white: .012, yellow: .016 }
};
const SALES_PHONE = "0352 978 519";
const SALES_ADVISOR = "Bùi Đắc Thịnh";

const numberValue = input => Math.max(0, Number(input) || 0);
const feeRow = (label, value, note = "") => `<div><span>${esc(label)}${note ? `<small>${esc(note)}</small>` : ""}</span><b>${money(value)}</b></div>`;

loadCars().then(cars => {
  const quoteCars = [...cars].sort((a,b) => a.price - b.price);
  const root = document.querySelector("#quote-root");
  root.innerHTML = `<section class="quote-hero"><span>CÔNG CỤ BÁO GIÁ</span><h1>Báo giá rõ ràng.<br>Chọn xe thật nhanh.</h1><p>Chọn xe, phiên bản, màu sắc và thông tin đăng ký để xem ngay chi phí dự kiến theo hai phương thức thanh toán.</p></section>
    <section class="quote-workspace"><form class="quote-form" id="quote-form">
      <div class="quote-form__heading"><span>THÔNG TIN BÁO GIÁ</span><h2>Lựa chọn của khách hàng</h2></div>
      <div class="customer-fields"><label><span>Tên khách hàng <small>Không bắt buộc</small></span><input id="customer-name" type="text" placeholder="Nhập tên khách hàng"></label><label><span>Số điện thoại <small>Không bắt buộc</small></span><input id="customer-phone" type="tel" placeholder="Nhập số điện thoại"></label></div>
      <fieldset><legend>Xe và phiên bản</legend><div class="form-grid"><label><span>Dòng xe · xếp theo giá tăng dần</span><select id="car-select">${quoteCars.map(car => `<option value="${car.slug}">${esc(car.name)}</option>`).join("")}</select></label><label><span>Phiên bản</span><select id="version-select"></select></label></div><label><span>Màu ngoại thất</span><select id="color-select"></select></label><label><span>Giảm giá <small>Có thể bỏ trống</small></span><div class="money-input"><input id="discount" type="number" min="0" step="1000000" inputmode="numeric" placeholder="0"><i>₫</i></div></label></fieldset>
      <fieldset><legend>Đăng ký và sử dụng</legend><div class="choice-group"><span>Khu vực đăng ký biển</span><div><label><input type="radio" name="registration" value="province" checked><b>Tỉnh</b><small>140.000 ₫</small></label><label><input type="radio" name="registration" value="city"><b>Thành phố</b><small>14.000.000 ₫</small></label></div></div><div class="choice-group"><span>Loại biển số</span><div><label><input type="radio" name="plate" value="white" checked><b>Biển trắng</b><small>Xe cá nhân</small></label><label><input type="radio" name="plate" value="yellow"><b>Biển vàng</b><small>Xe kinh doanh</small></label></div></div><label class="check-option"><input id="physical-cash" type="checkbox"><span><b>Thêm bảo hiểm vật chất cho thanh toán tiền mặt</b><small>Không bắt buộc khi mua tiền mặt. Phương án vay luôn bắt buộc.</small></span></label></fieldset>
    </form><aside class="quote-results" id="quote-results"></aside></section>`;

  const form = document.querySelector("#quote-form");
  const carSelect = document.querySelector("#car-select");
  const versionSelect = document.querySelector("#version-select");
  const colorSelect = document.querySelector("#color-select");

  const selectedCar = () => quoteCars.find(car => car.slug === carSelect.value) || quoteCars[0];

  function updateOptions() {
    const car = selectedCar();
    versionSelect.innerHTML = car.versions.map((version,index) => `<option value="${index}">${esc(version.name)} — ${money(version.price)}</option>`).join("");
    colorSelect.innerHTML = car.colors.map(color => { const fee = car.colorPrices?.[color] || 0; return `<option value="${esc(color)}">${esc(color)}${fee ? ` — thêm ${money(fee)}` : " — tiêu chuẩn"}</option>`; }).join("");
  }

  function calculate() {
    const car = selectedCar();
    const version = car.versions[Number(versionSelect.value) || 0];
    const color = colorSelect.value || car.colors[0];
    const listPrice = version.price;
    const discount = Math.min(numberValue(document.querySelector("#discount").value), listPrice);
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
      <section class="vehicle-cost"><h3>Giá trị xe</h3>${feeRow("Giá niêm yết",listPrice)}${feeRow("Giảm giá",-discount)}${feeRow("Phụ phí màu",colorFee)}<div class="subtotal"><span>Giá xe sau ưu đãi</span><b>${money(vehicleValue)}</b></div></section>
      <div class="payment-results"><article class="payment-card cash"><span>THANH TOÁN TIỀN MẶT</span><h3>${money(cashTotal)}</h3><p>Tổng chi phí dự kiến để nhận xe.</p><div class="fee-breakdown">${feeRow("Giá xe",vehicleValue)}${feeRow("Đăng ký biển",registration,registrationType === "city" ? "Thành phố" : "Tỉnh")}${feeRow("Lệ phí đăng kiểm",FEES.inspection)}${feeRow("Bảo trì đường bộ",road,plate === "white" ? "Biển trắng" : "Biển vàng")}${feeRow("Bảo hiểm TNDS",liability,sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ")}${document.querySelector("#physical-cash").checked ? feeRow("Bảo hiểm vật chất",physical,`${FEES.physicalRate[plate] * 100}% giá niêm yết`) : ""}</div></article>
      <article class="payment-card loan"><span>THANH TOÁN VAY</span><h3>${money(loanTotal)}</h3><p>Khoản tiền dự kiến cần chuẩn bị ban đầu.</p><div class="fee-breakdown">${feeRow("Trả trước 15% giá trị xe",downPayment)}${feeRow("Đăng ký biển",registration,registrationType === "city" ? "Thành phố" : "Tỉnh")}${feeRow("Lệ phí đăng kiểm",FEES.inspection)}${feeRow("Bảo trì đường bộ",road,plate === "white" ? "Biển trắng" : "Biển vàng")}${feeRow("Bảo hiểm TNDS",liability,sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ")}${feeRow("Bảo hiểm vật chất bắt buộc",physical,`${FEES.physicalRate[plate] * 100}% giá niêm yết`)}</div><div class="loan-note"><span>Dư nợ dự kiến 85%</span><b>${money(remainingLoan)}</b><small>Chưa bao gồm lãi vay ngân hàng.</small></div></article></div>
      <p class="quote-disclaimer">Báo giá mang tính tham khảo theo dữ liệu hiện có. Chi phí thực tế có thể thay đổi theo thời điểm, địa phương, ngân hàng và chính sách bán hàng.</p>`;
    document.querySelector("#print-quote").addEventListener("click", () => window.print());
  }

  carSelect.addEventListener("change", () => { updateOptions(); calculate(); });
  form.addEventListener("input", calculate);
  form.addEventListener("change", calculate);
  updateOptions();
  calculate();
}).catch(fail);
