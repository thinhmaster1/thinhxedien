export const PHYSICAL_INSURANCE_RATES = Object.freeze({ white: .012, yellow: .016 });
export const FIXED_PHYSICAL_INSURANCE = 4500000;
export const FIXED_PHYSICAL_INSURANCE_SLUGS = Object.freeze(["vf-2", "vf-3", "ec-van"]);
export const MANUAL_DISCOUNT_LIMITS = Object.freeze({
  "vf-2": 6000000,
  "minio-green": 6000000,
  "ec-van": 6000000,
  "vf-3": 6000000,
  "vf-5": 10000000,
  "vf-6": 12000000,
  "limo-green": 12000000,
  "vf-7": 15000000,
  "mpv-7": 15000000,
  "vf-8": 20000000,
  "vf-8-moi": 20000000,
  "vf-9": 25000000
});

export function manualDiscountLimit(carSlug) {
  return MANUAL_DISCOUNT_LIMITS[carSlug] ?? null;
}

export function tieredPromotionRate(program, audience, carSlug) {
  const group = program?.groups?.find(item => item.id === audience);
  if (!group) return 0;
  const tier = group.tiers.find(item => !item.default && item.carSlugs?.includes(carSlug))
    || group.tiers.find(item => item.default);
  return Math.max(0,Number(tier?.rate) || 0);
}

export function percentagePromotionDiscount(basePrice, rate) {
  return Math.round(Math.max(0,Number(basePrice) || 0) * Math.max(0,Number(rate) || 0));
}

export function vehiclePriceBeforePromotions(listPrice, colorFee = 0) {
  return Math.max(0,Number(listPrice) || 0) + Math.max(0,Number(colorFee) || 0);
}

export function downPaymentForLoanPercentage(vehicleValue, loanPercentage = 85) {
  const safeVehicleValue = Math.max(0,Number(vehicleValue) || 0);
  const numericPercentage = Number(loanPercentage);
  const safeLoanPercentage = Number.isFinite(numericPercentage) ? Math.min(100,Math.max(0,numericPercentage)) : 85;
  return Math.round(safeVehicleValue * (100 - safeLoanPercentage) / 100);
}

export function validateManualDiscount(input, maximumDiscount) {
  const raw = String(input ?? "").trim();
  const maximum = Math.max(0,Number(maximumDiscount) || 0);
  if (raw.includes("-")) return { value:0, error:"Giảm giá thêm không được là số âm." };
  const value = Math.max(0,Number(raw.replace(/[^\d]/g,"")) || 0);
  if (value > maximum) return { value:0, error:`Giảm giá thêm không được vượt quá ${new Intl.NumberFormat("en-US").format(maximum)} ₫.` };
  return { value, error:"" };
}

export function rollingCostsTotal(registrationCosts, physicalInsurance = 0) {
  return Math.max(0,Number(registrationCosts) || 0) + Math.max(0,Number(physicalInsurance) || 0);
}

export function roundUpToThousand(value) {
  return Math.ceil(Math.max(0,Number(value) || 0) / 1000) * 1000;
}

export function physicalInsuranceQuote(car, vehicleValue, plate = "white") {
  if (FIXED_PHYSICAL_INSURANCE_SLUGS.includes(car?.slug)) {
    return { amount: FIXED_PHYSICAL_INSURANCE, note: "Mức cố định theo dòng xe" };
  }
  const rate = PHYSICAL_INSURANCE_RATES[plate] ?? PHYSICAL_INSURANCE_RATES.white;
  return {
    amount: roundUpToThousand(Math.max(0,Number(vehicleValue) || 0) * rate),
    note: `${new Intl.NumberFormat("vi-VN",{ maximumFractionDigits:1 }).format(rate * 100)}% giá xe sau ưu đãi · làm tròn lên 1.000đ`
  };
}
