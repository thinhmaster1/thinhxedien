export const PHYSICAL_INSURANCE_RATES = Object.freeze({ white: .012, yellow: .016 });
export const FIXED_PHYSICAL_INSURANCE = 4500000;
export const FIXED_PHYSICAL_INSURANCE_SLUGS = Object.freeze(["vf-2", "vf-3", "ec-van"]);

export function physicalInsuranceQuote(car, listPrice, plate = "white") {
  if (FIXED_PHYSICAL_INSURANCE_SLUGS.includes(car?.slug)) {
    return { amount: FIXED_PHYSICAL_INSURANCE, note: "Mức cố định theo dòng xe" };
  }
  const rate = PHYSICAL_INSURANCE_RATES[plate] ?? PHYSICAL_INSURANCE_RATES.white;
  return {
    amount: Math.round(Math.max(0,Number(listPrice) || 0) * rate),
    note: `${new Intl.NumberFormat("vi-VN",{ maximumFractionDigits:1 }).format(rate * 100)}% giá niêm yết`
  };
}
