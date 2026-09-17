const asFiniteNumber = value => Number.isFinite(Number(value)) ? Number(value) : NaN;

export function calculateDecliningBalanceSchedule({ principal, annualRate, floatingAnnualRate, months, fixedMonths }) {
  const safePrincipal = asFiniteNumber(principal);
  const safeAnnualRate = asFiniteNumber(annualRate);
  const safeFloatingRate = asFiniteNumber(floatingAnnualRate);
  const safeMonths = Math.round(asFiniteNumber(months));
  const safeFixedMonths = Math.round(asFiniteNumber(fixedMonths));
  if (safePrincipal <= 0 || safeAnnualRate < 0 || safeFloatingRate < 0 || safeMonths < 1 || safeFixedMonths < 1 || safeFixedMonths > safeMonths) {
    throw new RangeError("Thông tin khoản vay không hợp lệ.");
  }

  const regularPrincipal = safePrincipal / safeMonths;
  let balance = safePrincipal;
  let totalInterest = 0;
  let totalPayment = 0;
  let balanceAfterFixed = safePrincipal;
  const rows = [];

  for (let month = 1; month <= safeMonths; month += 1) {
    const floating = month > safeFixedMonths;
    const appliedAnnualRate = floating ? safeFloatingRate : safeAnnualRate;
    const openingBalance = balance;
    const principalPayment = month === safeMonths ? openingBalance : Math.min(regularPrincipal,openingBalance);
    const interest = openingBalance * (appliedAnnualRate / 100 / 12);
    const payment = principalPayment + interest;
    balance = Math.max(0,openingBalance - principalPayment);
    if (month === safeFixedMonths) balanceAfterFixed = balance;
    totalInterest += interest;
    totalPayment += payment;
    rows.push({ month, floating, appliedAnnualRate, openingBalance, principalPayment, interest, payment, balance });
  }

  return {
    rows,
    regularPrincipal,
    totalInterest,
    totalPayment,
    balanceAfterFixed,
    introductoryFirstPayment: rows[0].payment,
    floatingFirstPayment: safeFixedMonths < safeMonths ? rows[safeFixedMonths].payment : null,
    finalPayment: rows.at(-1).payment
  };
}
