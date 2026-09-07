import { esc, fail, formatMoneyInput, loadCars, money, moneyInputValue } from "../core.js";
import { applySeo, Footer, Header } from "../components.js";

applySeo({ title: "Lập báo giá VinFast | Thịnh Xe Điện", canonical: "https://thinhmaster1.github.io/thinhxedien/quote.html" });
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
  liability: { white5: 530000, yellow5: 840000, white7: 880000, yellow7: 1190000 },
  physicalRate: { white: .012, yellow: .016 }
};
const SALES_PHONE = "0352 978 519";
const SALES_ADVISOR = "Bùi Đắc Thịnh";
const REGISTRATION_SERVICE_FEE = 3000000;
const QUOTE_IMAGE_WIDTH = 1080;
const QUOTE_IMAGE_FONT = '-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif';

const feeRow = (label, value, note = "") => `<div><span>${esc(label)}${note ? `<small>${esc(note)}</small>` : ""}</span><b>${money(value)}</b></div>`;

const setCanvasFont = (context, size, weight = 400) => {
  context.font = `${weight} ${size}px ${QUOTE_IMAGE_FONT}`;
};

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius,width / 2,height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius,y);
  context.arcTo(x + width,y,x + width,y + height,safeRadius);
  context.arcTo(x + width,y + height,x,y + height,safeRadius);
  context.arcTo(x,y + height,x,y,safeRadius);
  context.arcTo(x,y,x + width,y,safeRadius);
  context.closePath();
}

function wrappedLines(context, text, maxWidth) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let line = words.shift();
  words.forEach(word => {
    const candidate = `${line} ${word}`;
    if (context.measureText(candidate).width <= maxWidth) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  });
  lines.push(line);
  return lines;
}

function rowLayout(context, row, labelWidth) {
  setCanvasFont(context,22,600);
  const labelLines = wrappedLines(context,row.label,labelWidth);
  setCanvasFont(context,17,400);
  const noteLines = wrappedLines(context,row.note,labelWidth);
  return { labelLines, noteLines, height: Math.max(66,18 + labelLines.length * 28 + noteLines.length * 22 + 14) };
}

function rowsHeight(context, rows, labelWidth) {
  return rows.reduce((height,row) => height + rowLayout(context,row,labelWidth).height,0);
}

function drawRows(context, rows, x, y, width) {
  const labelWidth = width - 350;
  rows.forEach((row,index) => {
    const layout = rowLayout(context,row,labelWidth);
    if (row.isTotal) {
      context.fillStyle = "#edf6ff";
      roundedRect(context,x - 12,y + 4,width + 24,layout.height - 8,14);
      context.fill();
    }
    context.textAlign = "left";
    context.fillStyle = row.isTotal ? "#0879e8" : "#1d1d1f";
    setCanvasFont(context,22,row.isTotal ? 750 : 600);
    layout.labelLines.forEach((line,lineIndex) => context.fillText(line,x,y + 15 + lineIndex * 28));
    context.fillStyle = "#6e6e73";
    setCanvasFont(context,17,400);
    const noteTop = y + 16 + layout.labelLines.length * 28;
    layout.noteLines.forEach((line,lineIndex) => context.fillText(line,x,noteTop + lineIndex * 22));
    context.textAlign = "right";
    context.fillStyle = row.isTotal ? "#0879e8" : "#1d1d1f";
    setCanvasFont(context,row.isTotal ? 26 : 22,750);
    context.fillText(row.value,x + width,y + 16);
    if (!row.isTotal && index < rows.length - 1) {
      context.strokeStyle = "#e2e5e9";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x,y + layout.height - .5);
      context.lineTo(x + width,y + layout.height - .5);
      context.stroke();
    }
    y += layout.height;
  });
  context.textAlign = "left";
  return y;
}

const directText = element => [...(element?.childNodes || [])]
  .filter(node => node.nodeType === Node.TEXT_NODE)
  .map(node => node.textContent.trim())
  .filter(Boolean)
  .join(" ");

function resultRows(container) {
  return [...(container?.children || [])].filter(element => element.matches("div")).map(element => {
    const label = element.querySelector(":scope > span");
    return {
      label: directText(label),
      note: label?.querySelector("small")?.textContent.trim() || "",
      value: element.querySelector(":scope > b")?.textContent.trim() || "",
      isTotal: element.classList.contains("subtotal")
    };
  });
}

export function currentQuoteImageData() {
  const results = document.querySelector("#quote-results");
  const head = results.querySelector(".quote-result-head > div");
  const paymentPanel = results.querySelector("[data-payment-panel]:not([hidden])");
  const customer = head.querySelector(":scope > small")?.textContent.trim() || "";
  const loanNote = paymentPanel.querySelector(".loan-note");
  return {
    car: head.querySelector("h2").textContent.trim(),
    version: head.querySelector(":scope > p").textContent.trim(),
    customer,
    vehicleRows: resultRows(results.querySelector(".vehicle-cost")),
    paymentLabel: paymentPanel.querySelector(":scope > span").textContent.trim(),
    paymentTotal: paymentPanel.querySelector(":scope > h3").textContent.trim(),
    paymentDescription: paymentPanel.querySelector(":scope > p").textContent.trim(),
    paymentRows: resultRows(paymentPanel.querySelector(".fee-breakdown")),
    loan: loanNote ? {
      label: loanNote.querySelector(":scope > span").textContent.trim(),
      value: loanNote.querySelector(":scope > b").textContent.trim(),
      note: loanNote.querySelector(":scope > small").textContent.trim()
    } : null,
    disclaimer: results.querySelector(".quote-disclaimer").textContent.trim()
  };
}

export function quoteImageUrl(data) {
  const measureCanvas = document.createElement("canvas");
  const measureContext = measureCanvas.getContext("2d");
  const panelWidth = QUOTE_IMAGE_WIDTH - 80;
  const rowWidth = panelWidth - 64;
  const vehicleHeight = 86 + rowsHeight(measureContext,data.vehicleRows,rowWidth - 350);
  const paymentHeight = 174 + rowsHeight(measureContext,data.paymentRows,rowWidth - 350) + (data.loan ? 148 : 0);
  setCanvasFont(measureContext,18,400);
  const disclaimerLines = wrappedLines(measureContext,data.disclaimer,panelWidth - 64);
  const headerHeight = data.customer ? 342 : 310;
  const footerHeight = 112 + disclaimerLines.length * 25;
  const height = 40 + headerHeight + 24 + vehicleHeight + 24 + paymentHeight + 24 + footerHeight + 40;
  const canvas = document.createElement("canvas");
  canvas.width = QUOTE_IMAGE_WIDTH;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ tạo ảnh");

  context.textBaseline = "top";
  context.fillStyle = "#f3f6f9";
  context.fillRect(0,0,canvas.width,canvas.height);
  const gradient = context.createLinearGradient(40,40,QUOTE_IMAGE_WIDTH - 40,40 + headerHeight);
  gradient.addColorStop(0,"#0879e8");
  gradient.addColorStop(1,"#0054b4");
  context.fillStyle = gradient;
  roundedRect(context,40,40,panelWidth,headerHeight,30);
  context.fill();

  context.textAlign = "left";
  context.fillStyle = "#ddecff";
  setCanvasFont(context,18,750);
  context.fillText("THỊNH XE ĐIỆN · BÁO GIÁ DỰ KIẾN",76,76);
  context.textAlign = "right";
  setCanvasFont(context,17,600);
  context.fillText(new Intl.DateTimeFormat("vi-VN").format(new Date()),QUOTE_IMAGE_WIDTH - 76,78);
  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  setCanvasFont(context,58,750);
  context.fillText(data.car,76,126);
  context.fillStyle = "#ddecff";
  setCanvasFont(context,25,500);
  context.fillText(data.version,76,199);
  let headerLine = 241;
  if (data.customer) {
    context.fillStyle = "#ffffff";
    setCanvasFont(context,21,600);
    context.fillText(data.customer,76,headerLine);
    headerLine += 42;
  }
  context.strokeStyle = "#ffffff42";
  context.beginPath();
  context.moveTo(76,headerLine);
  context.lineTo(QUOTE_IMAGE_WIDTH - 76,headerLine);
  context.stroke();
  context.fillStyle = "#ddecff";
  setCanvasFont(context,17,500);
  context.fillText("TƯ VẤN BÁN HÀNG",76,headerLine + 21);
  context.fillStyle = "#ffffff";
  setCanvasFont(context,22,750);
  context.fillText(`${SALES_ADVISOR} · ${SALES_PHONE}`,270,headerLine + 17);

  let y = 40 + headerHeight + 24;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dfe3e8";
  context.lineWidth = 1;
  roundedRect(context,40,y,panelWidth,vehicleHeight,25);
  context.fill();
  context.stroke();
  context.fillStyle = "#0879e8";
  setCanvasFont(context,19,750);
  context.fillText("GIÁ TRỊ XE",72,y + 30);
  drawRows(context,data.vehicleRows,72,y + 72,rowWidth);

  y += vehicleHeight + 24;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dfe3e8";
  roundedRect(context,40,y,panelWidth,paymentHeight,25);
  context.fill();
  context.stroke();
  context.fillStyle = "#0879e8";
  setCanvasFont(context,19,750);
  context.fillText(data.paymentLabel,72,y + 30);
  context.fillStyle = "#1d1d1f";
  setCanvasFont(context,45,750);
  context.fillText(data.paymentTotal,72,y + 64);
  context.fillStyle = "#6e6e73";
  setCanvasFont(context,18,400);
  context.fillText(data.paymentDescription,72,y + 121);
  let paymentY = drawRows(context,data.paymentRows,72,y + 158,rowWidth);
  if (data.loan) {
    context.fillStyle = "#edf6ff";
    roundedRect(context,64,paymentY + 12,panelWidth - 48,120,18);
    context.fill();
    context.fillStyle = "#6e6e73";
    setCanvasFont(context,17,600);
    context.fillText(data.loan.label,88,paymentY + 33);
    context.fillStyle = "#0879e8";
    setCanvasFont(context,29,750);
    context.fillText(data.loan.value,88,paymentY + 59);
    context.textAlign = "right";
    context.fillStyle = "#6e6e73";
    setCanvasFont(context,16,400);
    context.fillText(data.loan.note,QUOTE_IMAGE_WIDTH - 88,paymentY + 67);
    context.textAlign = "left";
  }

  y += paymentHeight + 24;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dfe3e8";
  roundedRect(context,40,y,panelWidth,footerHeight,25);
  context.fill();
  context.stroke();
  context.fillStyle = "#0879e8";
  setCanvasFont(context,18,750);
  context.fillText("LƯU Ý",72,y + 28);
  context.fillStyle = "#6e6e73";
  setCanvasFont(context,18,400);
  disclaimerLines.forEach((line,index) => context.fillText(line,72,y + 61 + index * 25));
  context.fillStyle = "#1d1d1f";
  setCanvasFont(context,17,700);
  context.fillText("VinFast Bình Thủy Thủ Dầu Một · 645 Đại lộ Bình Dương",72,y + footerHeight - 34);

  return canvas.toDataURL("image/png");
}

function downloadQuoteImage(car, paymentMode) {
  const button = document.querySelector("#download-quote-image");
  const status = document.querySelector("#quote-export-status");
  button.disabled = true;
  button.textContent = "Đang tạo ảnh...";
  status.textContent = "";
  try {
    const link = document.createElement("a");
    const paymentName = paymentMode === "cash" ? "tra-thang" : "tra-gop";
    link.href = quoteImageUrl(currentQuoteImageData());
    link.download = `bao-gia-${car.slug}-${paymentName}.png`;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    status.textContent = "Đã tải ảnh PNG.";
  } catch (error) {
    console.error(error);
    status.textContent = "Không thể tạo ảnh. Vui lòng thử lại.";
  } finally {
    button.disabled = false;
    button.textContent = "Tải ảnh báo giá";
  }
}

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
      <fieldset><legend>Ưu đãi áp dụng</legend><div class="quote-promotion-group"><span>Ưu đãi theo dòng xe</span><div class="promotion-options" id="model-promotions"></div></div><label><span>Ưu đãi theo khách hàng</span><select id="customer-promotion"><option value="">Không áp dụng</option>${promotions.quoteOptions.customer.map(item => `<option value="${esc(item.id)}">${esc(item.label)}</option>`).join("")}</select></label><label><span>Giảm giá thêm <small>Có thể bỏ trống</small></span><div class="money-input"><input id="discount" type="text" inputmode="numeric" placeholder="0"><i>₫</i></div></label></fieldset>
      <fieldset class="vinclub-quote-section" id="vinclub-promotion"><legend>Ưu đãi VinClub</legend><div class="vinclub-quote-heading"><span>Chọn hạng thành viên</span><small>Không áp dụng cùng QĐ hoặc VNPost</small></div><div class="vinclub-quote-options" role="radiogroup" aria-label="Hạng VinClub"><label class="is-none"><input type="radio" name="vinclubPromotion" value="" checked><span><b>Không áp dụng</b><small>Không sử dụng quyền lợi VinClub</small></span><i aria-hidden="true">✓</i></label>${promotions.quoteOptions.vinclub.map(item => { const title = item.label.split(" · ")[0].replace(/^VinClub\s+/i,""); const [name,hint] = title.split(" / "); return `<label><input type="radio" name="vinclubPromotion" value="${esc(item.id)}"><span><b>${esc(name)}</b>${hint ? `<em>${esc(hint)}</em>` : ""}<small>Giảm trực tiếp</small><strong>${String(item.value * 100).replace(".",",")}%</strong></span><i aria-hidden="true">✓</i></label>`; }).join("")}</div><p class="promotion-help" id="promotion-help">${esc(promotions.quoteOptions.note)}</p></fieldset>
      <fieldset><legend>Đăng ký và sử dụng</legend><div class="choice-group"><span>Khu vực đăng ký biển</span><div><label><input type="radio" name="registration" value="province" checked><b>Tỉnh</b><small>140.000 ₫</small></label><label><input type="radio" name="registration" value="city"><b>Thành phố</b><small>14.000.000 ₫</small></label></div></div><div class="choice-group"><span>Loại biển số</span><div><label><input type="radio" name="plate" value="white" checked><b>Biển trắng</b><small>Xe cá nhân</small></label><label><input type="radio" name="plate" value="yellow"><b>Biển vàng</b><small>Xe kinh doanh</small></label></div></div><label class="check-option"><input id="physical-cash" type="checkbox"><span><b>Thêm bảo hiểm vật chất cho thanh toán tiền mặt</b><small>Không bắt buộc khi mua tiền mặt. Phương án vay luôn bắt buộc.</small></span></label></fieldset>
    </form><aside class="quote-results" id="quote-results"></aside></section>`;

  const form = document.querySelector("#quote-form");
  const carSelect = document.querySelector("#car-select");
  const versionSelect = document.querySelector("#version-select");
  const colorSelect = document.querySelector("#color-select");
  const modelPromotionsRoot = document.querySelector("#model-promotions");
  const customerPromotionSelect = document.querySelector("#customer-promotion");
  const vinclubPromotionRoot = document.querySelector("#vinclub-promotion");
  const promotionHelp = document.querySelector("#promotion-help");
  const discountInput = document.querySelector("#discount");
  let paymentMode = "cash";

  const selectedCar = () => quoteCars.find(car => car.slug === carSelect.value) || quoteCars[0];

  function syncPromotionRules() {
    const customerPromotion = promotions.quoteOptions.customer.find(item => item.id === customerPromotionSelect.value);
    const excludesVinClub = customerPromotion?.excludes?.includes("vinclub");
    if (excludesVinClub) vinclubPromotionRoot.querySelector('[name="vinclubPromotion"][value=""]').checked = true;
    vinclubPromotionRoot.disabled = Boolean(excludesVinClub);
    vinclubPromotionRoot.classList.toggle("is-disabled",Boolean(excludesVinClub));
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
    const selectedVinclubId = form.elements.vinclubPromotion.value;
    const vinclubPromotion = promotions.quoteOptions.vinclub.find(item => item.id === selectedVinclubId);
    const modelDiscount = Math.min(modelPromotions.filter(item => item.type === "fixed").reduce((total,item) => total + item.value,0),listPrice);
    const customerBase = customerPromotion?.base === "afterModel" ? Math.max(0,listPrice - modelDiscount) : listPrice;
    const requestedCustomerDiscount = customerPromotion?.type === "percent" ? customerBase * customerPromotion.value : customerPromotion?.type === "fixed" ? customerPromotion.value : 0;
    const customerDiscount = Math.min(requestedCustomerDiscount,Math.max(0,listPrice - modelDiscount));
    const policyPrice = Math.max(0,listPrice - modelDiscount - customerDiscount);
    const requestedVinclubDiscount = vinclubPromotion?.type === "percent" ? policyPrice * vinclubPromotion.value : vinclubPromotion?.type === "fixed" ? vinclubPromotion.value : 0;
    const vinclubDiscount = Math.min(requestedVinclubDiscount,policyPrice);
    const manualDiscount = Math.min(moneyInputValue(discountInput.value),Math.max(0,policyPrice - vinclubDiscount));
    const discount = modelDiscount + customerDiscount + vinclubDiscount + manualDiscount;
    const colorFee = car.colorPrices?.[color] || 0;
    const vehicleValue = Math.max(0, listPrice - discount + colorFee);
    const registrationType = form.elements.registration.value;
    const registrationService = REGISTRATION_SERVICE_FEE;
    const plate = form.elements.plate.value;
    const sevenSeats = /(?:6\s*\/\s*7|7)\s*chỗ/i.test(car.specs.seats || "");
    const registration = FEES.registration[registrationType];
    const road = FEES.road[plate];
    const liability = FEES.liability[`${plate}${sevenSeats ? 7 : 5}`];
    const physical = Math.round(listPrice * FEES.physicalRate[plate]);
    const fixedFees = registration + registrationService + FEES.inspection + road + liability;
    const cashPhysical = document.querySelector("#physical-cash").checked ? physical : 0;
    const cashTotal = vehicleValue + fixedFees + cashPhysical;
    const downPayment = Math.round(vehicleValue * .15);
    const loanTotal = downPayment + fixedFees + physical;
    const remainingLoan = vehicleValue - downPayment;
    const customer = document.querySelector("#customer-name").value.trim();
    const customerPhone = document.querySelector("#customer-phone").value.trim();

    document.querySelector("#quote-results").innerHTML = `<div class="quote-result-head"><div><span>BÁO GIÁ DỰ KIẾN</span><h2>${esc(car.name)}</h2><p>${esc(version.name)} · ${esc(color)}</p>${customer ? `<small>Khách hàng: ${esc(customer)}${customerPhone ? ` · ${esc(customerPhone)}` : ""}</small>` : customerPhone ? `<small>SĐT khách hàng: ${esc(customerPhone)}</small>` : ""}<a class="quote-contact" href="tel:0352978519"><span>Tư vấn bán hàng</span><b>${SALES_ADVISOR}</b><small>${SALES_PHONE}</small></a></div><div class="quote-actions"><button class="is-secondary" type="button" id="download-quote-image">Tải ảnh báo giá</button><small id="quote-export-status" role="status" aria-live="polite"></small></div></div>
      <section class="vehicle-cost"><h3>Giá trị xe</h3>${feeRow("Giá niêm yết",listPrice)}${modelPromotions.filter(item => item.type === "fixed").map(item => feeRow("Ưu đãi dòng xe",-item.value,item.label)).join("")}${modelPromotions.filter(item => item.type === "gift").map(item => `<div class="promotion-gift"><span>${esc(item.label)}<small>${esc(item.note || "Quà tặng kèm")}</small></span><b>Tặng kèm</b></div>`).join("")}${customerPromotion ? feeRow("Ưu đãi khách hàng",-customerDiscount,customerPromotion.label) : ""}${vinclubPromotion ? `<div class="policy-base"><span>Giá sau chính sách<small>Cơ sở tính ưu đãi VinClub</small></span><b>${money(policyPrice)}</b></div>${feeRow("Ưu đãi VinClub",-vinclubDiscount,`${vinclubPromotion.label} × giá sau chính sách`)}` : ""}${manualDiscount ? feeRow("Giảm giá thêm",-manualDiscount) : ""}${feeRow("Phụ phí màu",colorFee)}<div class="subtotal"><span>Giá xe sau ưu đãi</span><b>${money(vehicleValue)}</b></div></section>
      <div class="payment-switch" role="tablist" aria-label="Phương thức thanh toán"><button type="button" role="tab" data-payment-mode="cash" aria-selected="${paymentMode === "cash"}">Trả thẳng</button><button type="button" role="tab" data-payment-mode="loan" aria-selected="${paymentMode === "loan"}">Trả góp</button></div>
      <div class="payment-results"><article class="payment-card cash" data-payment-panel="cash" ${paymentMode === "cash" ? "" : "hidden"}><span>THANH TOÁN TIỀN MẶT</span><h3>${money(cashTotal)}</h3><p>Tổng chi phí dự kiến để nhận xe.</p><div class="fee-breakdown">${feeRow("Giá xe",vehicleValue)}${feeRow("Đăng ký biển",registration,registrationType === "city" ? "Thành phố" : "Tỉnh")}${feeRow("Phí dịch vụ đăng ký xe",registrationService)}${feeRow("Lệ phí đăng kiểm",FEES.inspection)}${feeRow("Bảo trì đường bộ",road,plate === "white" ? "Biển trắng" : "Biển vàng")}${feeRow("Bảo hiểm TNDS",liability,sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ")}${document.querySelector("#physical-cash").checked ? feeRow("Bảo hiểm vật chất",physical,`${FEES.physicalRate[plate] * 100}% giá niêm yết`) : ""}</div></article>
      <article class="payment-card loan" data-payment-panel="loan" ${paymentMode === "loan" ? "" : "hidden"}><span>THANH TOÁN VAY</span><h3>${money(loanTotal)}</h3><p>Khoản tiền dự kiến cần chuẩn bị ban đầu.</p><div class="fee-breakdown">${feeRow("Trả trước 15% giá trị xe",downPayment)}${feeRow("Đăng ký biển",registration,registrationType === "city" ? "Thành phố" : "Tỉnh")}${feeRow("Phí dịch vụ đăng ký xe",registrationService)}${feeRow("Lệ phí đăng kiểm",FEES.inspection)}${feeRow("Bảo trì đường bộ",road,plate === "white" ? "Biển trắng" : "Biển vàng")}${feeRow("Bảo hiểm TNDS",liability,sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ")}${feeRow("Bảo hiểm vật chất bắt buộc",physical,`${FEES.physicalRate[plate] * 100}% giá niêm yết`)}</div><div class="loan-note"><span>Dư nợ dự kiến 85%</span><b>${money(remainingLoan)}</b><small>Chưa bao gồm lãi vay ngân hàng.</small><a href="loan.html?amount=${Math.ceil(remainingLoan)}">Tính lãi và lịch trả góp <span>›</span></a></div></article></div>
      <p class="quote-disclaimer">Báo giá mang tính tham khảo theo dữ liệu hiện có. Chi phí thực tế có thể thay đổi theo thời điểm, địa phương, ngân hàng và chính sách bán hàng.</p>`;
    document.querySelector("#download-quote-image").addEventListener("click", () => downloadQuoteImage(car,paymentMode));
    document.querySelectorAll("[data-payment-mode]").forEach(button => button.addEventListener("click", () => {
      paymentMode = button.dataset.paymentMode;
      document.querySelectorAll("[data-payment-mode]").forEach(item => item.setAttribute("aria-selected",String(item.dataset.paymentMode === paymentMode)));
      document.querySelectorAll("[data-payment-panel]").forEach(panel => { panel.hidden = panel.dataset.paymentPanel !== paymentMode; });
    }));
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
