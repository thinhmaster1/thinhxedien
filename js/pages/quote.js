import { renderQuoteForm,renderQuoteResults } from '../quote-view.js?v=2026100602';
import { downloadQuoteImage } from "../quote-image.js?v=2026100602";
import { validateMoneyInput, promotionAvailability, localDateKey } from "../quote-validation.js?v=2026100602";
import { esc, fail, formatMoneyInput, loadCars, loadPromotions, money } from "../core.js?v=2026091903";
import { applySeo, mountSiteShell } from "../components.js?v=2026100501";
import { quoteLoanBreakdown, manualDiscountLimit, percentagePromotionDiscount, physicalInsuranceQuote, rollingCostsTotal, tieredPromotionRate, validateManualDiscount, vehiclePriceBeforePromotions } from "../quote-calculator.js?v=2026100602";

applySeo({ title: "Lập báo giá VinFast | Thịnh Xe Điện", canonical: "https://thinhmaster1.github.io/thinhxedien/quote.html" });
let robotsMeta = document.head.querySelector('meta[name="robots"]');
if (!robotsMeta) {
  robotsMeta = document.createElement("meta");
  robotsMeta.name = "robots";
  document.head.appendChild(robotsMeta);
}
robotsMeta.content = "noindex,nofollow";

mountSiteShell();

const FEES = {
  registration: { province: 140000, city: 14000000 },
  inspection: 95000,
  road: { white: 1560000, yellow: 2160000 },
  liability: { white5: 530000, yellow5: 840000, white7: 880000, yellow7: 1190000 }
};
const SALES_PHONE = "0352 978 519";
const SALES_ADVISOR = "Bùi Đắc Thịnh";

const formatPercentage = value => new Intl.NumberFormat('vi-VN',{ maximumFractionDigits:1 }).format(value);

Promise.all([loadCars(),loadPromotions()]).then(([cars,promotions]) => {
  const quoteCars = [...cars].sort((a,b) => a.price - b.price);
  const root = document.querySelector("#quote-root");
  root.innerHTML = renderQuoteForm(quoteCars,promotions);

  const form = document.querySelector("#quote-form");
  const confirmationLabel = document.createElement('label');
  confirmationLabel.className = 'check-option';
  confirmationLabel.innerHTML = '<input id="promotion-confirmed" type="checkbox"><span><b>Đã kiểm tra hồ sơ và điều kiện ưu đãi</b><small>Bao gồm cọc cũ, ngày xuất hóa đơn và khả năng cộng gộp. Chưa xác nhận thì ưu đãi không được tính.</small></span>';
  document.querySelector('#model-promotions').closest('fieldset').append(confirmationLabel);
  const confirmed = confirmationLabel.querySelector('input');
  for (const id of ['customer-name','customer-phone']) {
    const input = document.getElementById(id);
    input.maxLength = id === 'customer-name' ? 120 : 20;
    input.autocomplete = 'off';
  }
  document.querySelector('.customer-fields').insertAdjacentHTML('afterend', '<p class="promotion-help">Thông tin khách chỉ dùng trong phiên hiện tại, không được website lưu hoặc gửi tự động. Ảnh tải về và tên file có thể chứa tên/SĐT; chỉ chia sẻ với người được phép.</p>');
  const carSelect = document.querySelector("#car-select");
  const versionSelect = document.querySelector("#version-select");
  const colorSelect = document.querySelector("#color-select");
  const modelPromotionsRoot = document.querySelector("#model-promotions");
  const customerPromotionSelect = document.querySelector("#customer-promotion");
  const discountInput = document.querySelector("#discount");
  const discountLimitNote = document.querySelector("#discount-limit");
  const discountNote = document.querySelector("#discount-note");
  const loanOptions = document.querySelector("#loan-quote-options");
  const downPaymentInput = document.querySelector("#loan-down-payment");
  const downPaymentNote = document.querySelector("#loan-down-payment-note");
  const loanPercentageButtons = [...document.querySelectorAll("[data-loan-percentage]")];
  let paymentMode = "cash";
  let selectedLoanPercentage = 85;

  const selectedCar = () => quoteCars.find(car => car.slug === carSelect.value) || quoteCars[0];
  const customerPromotionRate = (promotion,carSlug) => promotion?.type === "programPercent"
    ? tieredPromotionRate(promotions[promotion.program],promotion.audience,carSlug)
    : Number(promotion?.value) || 0;

  function updateOptions() {
    const car = selectedCar();
    versionSelect.innerHTML = car.versions.map((version,index) => `<option value="${index}">${esc(version.name)} — ${money(version.price)}</option>`).join("");
    colorSelect.innerHTML = car.colors.map(color => { const fee = car.colorPrices?.[color] || 0; return `<option value="${esc(color)}">${esc(color)}${car.pendingColorPrices?.includes(color) ? " — nâng cao, chưa có phụ phí" : fee ? ` — thêm ${money(fee)}` : " — tiêu chuẩn"}</option>`; }).join("");
    const applicable = promotions.quoteOptions.model.filter(item => item.carSlugs.includes(car.slug));
    modelPromotionsRoot.innerHTML = applicable.length ? applicable.map(item => `<label><input type="checkbox" name="modelPromotion" value="${esc(item.id)}"><span><b>${esc(item.label)}</b><small>${esc(item.note || "Theo chính sách hiện hành")}</small></span></label>`).join("") : `<p>Chưa có ưu đãi riêng cho dòng xe này.</p>`;
    [...customerPromotionSelect.options].forEach(option => {
      if (!option.value) return;
      const promotion = promotions.quoteOptions.customer.find(item => item.id === option.value);
      option.textContent = promotion?.type === "programPercent"
        ? `${promotion.label} · Giảm ${formatPercentage(customerPromotionRate(promotion,car.slug) * 100)}% MSRP`
        : promotion.label;
    });
  }

  function calculate() {
    const car = selectedCar();
    const version = car.versions[Number(versionSelect.value)] || car.versions[0];
    const color = colorSelect.value || car.colors[0];
    const listPrice = version.price;
    const colorFee = car.colorPrices?.[color] || 0;
    const pendingColorPrice = car.pendingColorPrices?.includes(color);
    const promotionBase = vehiclePriceBeforePromotions(listPrice,colorFee);
    const selectedPromotionIds = [...form.querySelectorAll('[name="modelPromotion"]:checked')].map(input => input.value);
    const requestedModelPromotions = promotions.quoteOptions.model.filter(item => selectedPromotionIds.includes(item.id) && item.carSlugs.includes(car.slug));
    const requestedCustomerPromotion = promotions.quoteOptions.customer.find(item => item.id === customerPromotionSelect.value);
    const requestedPromotions = [...requestedModelPromotions, ...(requestedCustomerPromotion ? [requestedCustomerPromotion] : [])];
    const expiredPromotions = requestedPromotions.filter(item => !promotionAvailability(item,promotions).available);
    const modelPromotions = confirmed.checked ? requestedModelPromotions.filter(item => promotionAvailability(item,promotions).available) : [];
    const customerPromotion = confirmed.checked && requestedCustomerPromotion && promotionAvailability(requestedCustomerPromotion,promotions).available ? requestedCustomerPromotion : null;
    const modelDiscount = Math.min(modelPromotions.filter(item => item.type === "fixed").reduce((total,item) => total + item.value,0),promotionBase);
    const customerBase = customerPromotion?.base === "afterModel" ? Math.max(0,promotionBase - modelDiscount) : promotionBase;
    const customerRate = customerPromotionRate(customerPromotion,car.slug);
    const requestedCustomerDiscount = ["percent","programPercent"].includes(customerPromotion?.type) ? percentagePromotionDiscount(customerBase,customerRate) : customerPromotion?.type === "fixed" ? customerPromotion.value : 0;
    const customerDiscount = Math.min(requestedCustomerDiscount,Math.max(0,promotionBase - modelDiscount));
    const customerPromotionNote = customerPromotion?.type === "programPercent" ? `${customerPromotion.label} · ${formatPercentage(customerRate * 100)}% MSRP` : customerPromotion?.label;
    const policyPrice = Math.max(0,promotionBase - modelDiscount - customerDiscount);
    const configuredDiscountLimit = manualDiscountLimit(car.slug);
    const manualDiscountMaximum = policyPrice;
    discountLimitNote.textContent = configuredDiscountLimit == null
      ? "Chưa có gợi ý mức giảm thêm tối đa cho dòng xe này."
      : `Gợi ý giảm thêm tối đa: ${money(configuredDiscountLimit)}.`;
    const parsedDiscount = validateMoneyInput(discountInput.value,Number.MAX_SAFE_INTEGER,'Giảm thêm');
    const manualDiscountValidation = parsedDiscount.error ? { value:0, error:parsedDiscount.error } : validateManualDiscount(discountInput.value,manualDiscountMaximum);
    const manualDiscount = manualDiscountValidation.value;
    discountInput.setCustomValidity(manualDiscountValidation.error);
    discountInput.setAttribute("aria-invalid",String(Boolean(manualDiscountValidation.error)));
    discountNote.textContent = manualDiscountValidation.error;
    const discount = modelDiscount + customerDiscount + manualDiscount;
    const vehicleValue = Math.max(0,promotionBase - discount);
    const registrationType = form.elements.registration.value;
    const registrationService = [0,3000000,5000000].includes(Number(form.elements.registrationService.value)) ? Number(form.elements.registrationService.value) : 3000000;
    const plate = form.elements.plate.value;
    const sevenSeats = /(?:6\s*\/\s*7|7)\s*chỗ/i.test(car.specs.seats || "");
    const registration = FEES.registration[registrationType];
    const road = FEES.road[plate];
    const liability = FEES.liability[`${plate}${sevenSeats ? 7 : 5}`];
    const liabilityNote = car.liabilityNote || (sevenSeats ? "7 chỗ" : "Tối đa 5 chỗ");
    const physicalInsurance = physicalInsuranceQuote(car,vehicleValue,plate);
    const physical = physicalInsurance.amount;
    const fixedFees = registration + registrationService + FEES.inspection + road + liability;
    const cashPhysical = document.querySelector("#physical-cash").checked ? physical : 0;
    const cashRollingCosts = rollingCostsTotal(fixedFees,cashPhysical);
    const loanRollingCosts = rollingCostsTotal(fixedFees,physical);
    const cashTotal = vehicleValue + cashRollingCosts;
    const customDownPayment = downPaymentInput.dataset.customized === "true";
    const parsedDownPayment = validateMoneyInput(downPaymentInput.value,vehicleValue,'Trả trước');
    const requestedDownPayment = parsedDownPayment.value;
    downPaymentInput.setCustomValidity(paymentMode === 'loan' && customDownPayment ? parsedDownPayment.error : '');
    downPaymentInput.setAttribute('aria-invalid',String(customDownPayment && Boolean(parsedDownPayment.error)));
    const { downPayment,remainingLoan,downPaymentPercentage,loanPercentage } = quoteLoanBreakdown(vehicleValue,customDownPayment ? requestedDownPayment : null,selectedLoanPercentage ?? 85);
    if (!customDownPayment || requestedDownPayment > vehicleValue) {
      downPaymentInput.value = String(downPayment);
      formatMoneyInput(downPaymentInput);
    }
    const loanTotal = downPayment + loanRollingCosts;
    const downPaymentPercentageText = formatPercentage(downPaymentPercentage);
    const loanPercentageText = formatPercentage(loanPercentage);
    downPaymentNote.textContent = customDownPayment && parsedDownPayment.error ? parsedDownPayment.error : `Trả trước ${downPaymentPercentageText}% · khoản vay dự kiến ${loanPercentageText}% giá trị xe.`;
    loanPercentageButtons.forEach(button => button.setAttribute("aria-pressed",String(!customDownPayment && Number(button.dataset.loanPercentage) === selectedLoanPercentage)));
    const customer = document.querySelector("#customer-name").value.trim();
    const customerPhone = document.querySelector("#customer-phone").value.trim();
    const phoneInput = document.querySelector('#customer-phone');
    phoneInput.setCustomValidity(customerPhone && (!/^[0-9 +()-]{9,20}$/.test(customerPhone) || customerPhone.replace(/\D/g,'').length < 9) ? 'Số điện thoại không hợp lệ.' : '');

    document.querySelector('#quote-results').innerHTML = renderQuoteResults({car,version,color,customer,customerPhone,listPrice,pendingColorPrice,colorFee,modelPromotions,customerPromotion,customerDiscount,customerPromotionNote,manualDiscount,vehicleValue,paymentMode,cashTotal,loanTotal,registration,registrationType,registrationService,road,plate,liability,liabilityNote,physical,physicalInsurance,cashRollingCosts,loanRollingCosts,downPayment,downPaymentPercentageText,loanPercentageText,remainingLoan, physicalCash:document.querySelector('#physical-cash').checked, inspection:FEES.inspection});
    const warnings = [];
    if (requestedPromotions.length && !confirmed.checked) warnings.push('Chưa xác nhận điều kiện: ưu đãi đã chọn chưa được áp dụng.');
    if (expiredPromotions.length) warnings.push('Có ưu đãi chưa đến hạn hoặc đã hết hạn: không áp dụng và không xuất ảnh.');
    if (manualDiscountValidation.error) warnings.push(manualDiscountValidation.error);
    if (paymentMode === 'loan' && customDownPayment && parsedDownPayment.error) warnings.push(parsedDownPayment.error);
    if (!document.querySelector('#customer-phone').checkValidity()) warnings.push('Số điện thoại không hợp lệ.');
    const issued = localDateKey();
    document.querySelector('.quote-disclaimer').prepend(`Ngày lập: ${issued}. Đây không phải hợp đồng hoặc cam kết cấp tín dụng. Cần xác nhận hồ sơ, ưu đãi và chi phí trước giao dịch. `);
    if (warnings.length) document.querySelector('.quote-disclaimer').append(` ${warnings.join(' ')}`);
    const exportButton = document.querySelector('#download-quote-image');
    exportButton.disabled = warnings.length > 0;
    exportButton.addEventListener('click', () => {
      if (!exportButton.disabled && form.checkValidity()) downloadQuoteImage(car,paymentMode);
    });
    if (pendingColorPrice) {
      document.querySelector(".quote-disclaimer").append(` Báo giá tạm tính CHƯA BAO GỒM phụ phí màu ${color}; giá xe, ưu đãi, bảo hiểm và khoản vay sẽ được tính lại khi có phụ phí chính thức.`);
    }
    loanOptions.hidden = paymentMode !== "loan";
    document.querySelectorAll("[data-payment-mode]").forEach(button => button.addEventListener("click", () => {
      paymentMode = button.dataset.paymentMode;
      calculate();
      if (paymentMode === "loan" && matchMedia("(max-width: 980px)").matches) {
        requestAnimationFrame(() => loanOptions.scrollIntoView({ behavior:"smooth", block:"center" }));
      }
    }));
  }

  carSelect.addEventListener("change", () => { updateOptions(); calculate(); });
  discountInput.addEventListener("input", () => {
    if (!validateMoneyInput(discountInput.value).error) formatMoneyInput(discountInput);
  });
  downPaymentInput.addEventListener("input", () => {
    selectedLoanPercentage = null;
    downPaymentInput.dataset.customized = "true";
    if (!validateMoneyInput(downPaymentInput.value).error) formatMoneyInput(downPaymentInput);
  });
  downPaymentInput.addEventListener("blur", () => {
    if (downPaymentInput.value) return;
    selectedLoanPercentage = 85;
    delete downPaymentInput.dataset.customized;
    calculate();
  });
  loanPercentageButtons.forEach(button => button.addEventListener("click", () => {
    selectedLoanPercentage = Number(button.dataset.loanPercentage);
    delete downPaymentInput.dataset.customized;
    calculate();
  }));
  form.addEventListener("input", calculate);
  form.addEventListener("change", calculate);
  form.addEventListener('change', event => {
    if (event.target.matches('#car-select,#version-select,#color-select,#customer-promotion,[name="modelPromotion"]')) {
      confirmed.checked = false;
      calculate();
    }
  });
  form.addEventListener('submit', event => event.preventDefault());
  updateOptions();
  calculate();
}).catch(fail);
