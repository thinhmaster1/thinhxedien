export const PHYSICAL_INSURANCE_RATES = Object.freeze({ white: .012, yellow: .016 });
export const FIXED_PHYSICAL_INSURANCE = 4500000;
export const FIXED_PHYSICAL_INSURANCE_SLUGS = Object.freeze(["vf-2", "vf-3", "ec-van"]);

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

export function rollingCostsTotal(registrationCosts, physicalInsurance = 0) {
  return Math.max(0,Number(registrationCosts) || 0) + Math.max(0,Number(physicalInsurance) || 0);
}

export function physicalInsuranceQuote(car, vehicleValue, plate = "white") {
  if (FIXED_PHYSICAL_INSURANCE_SLUGS.includes(car?.slug)) {
    return { amount: FIXED_PHYSICAL_INSURANCE, note: "Mức cố định theo dòng xe" };
  }
  const rate = PHYSICAL_INSURANCE_RATES[plate] ?? PHYSICAL_INSURANCE_RATES.white;
  return {
    amount: Math.round(Math.max(0,Number(vehicleValue) || 0) * rate),
    note: `${new Intl.NumberFormat("vi-VN",{ maximumFractionDigits:1 }).format(rate * 100)}% giá xe sau ưu đãi`
  };
}
