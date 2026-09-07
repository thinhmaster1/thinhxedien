import { applySeo, Footer, Header } from "../components.js";
import { formatMoneyInput, money, moneyInputValue } from "../core.js";

applySeo({
  title: "Tính lãi suất vay mua xe & dư nợ trả góp",
  description: "Nhập số tiền vay, lãi suất và thời hạn để xem khoản trả hàng tháng, tổng lãi cùng lịch dư nợ chi tiết.",
  canonical: "https://thinhmaster1.github.io/thinhxedien/loan.html"
});

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

const form = document.querySelector("#loan-form");
const currency = value => money(value);
const amountInput = document.querySelector("#loan-amount");
const rateInput = document.querySelector("#loan-rate");
const floatingRateInput = document.querySelector("#loan-floating-rate");
const fixedMonthsInput = document.querySelector("#loan-fixed-months");
const yearsInput = document.querySelector("#loan-years");
const scheduleBody = document.querySelector("#loan-schedule-body");
const transferredAmount = Number(new URLSearchParams(location.search).get("amount"));
if (Number.isFinite(transferredAmount) && transferredAmount > 0) amountInput.value = String(Math.ceil(transferredAmount));
formatMoneyInput(amountInput);

const annuityPayment = (principal, monthlyRate, months) => {
  if (!months) return 0;
  return monthlyRate === 0 ? principal / months : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
};
const percentage = value => new Intl.NumberFormat("vi-VN",{ maximumFractionDigits:2 }).format(value);
const normalizeInput = (input,min,max,{ integer = false } = {}) => {
  if (!input.value.trim()) return null;
  const raw = Number(input.value);
  if (!Number.isFinite(raw)) return null;
  const value = Math.min(max,Math.max(min,integer ? Math.round(raw) : raw));
  if (value !== raw) input.value = String(value);
  return value;
};
const clearResults = () => {
  ["monthly-payment","floating-payment","balance-after-fixed","loan-term-label","total-interest","total-payment","principal-total"].forEach(id => {
    document.querySelector(`#${id}`).textContent = "—";
  });
  document.querySelector("#floating-start-label").textContent = "Nhập đầy đủ số tiền vay và thời hạn hợp lệ.";
  scheduleBody.innerHTML = '<tr><td class="loan-empty-row" colspan="7">Nhập đầy đủ thông tin để xem lịch thanh toán.</td></tr>';
};

function calculate() {
  const principal = moneyInputValue(amountInput.value);
  const annualRate = normalizeInput(rateInput,0,100);
  const floatingAnnualRate = normalizeInput(floatingRateInput,0,100);
  const years = normalizeInput(yearsInput,1,30,{ integer:true });
  const months = years == null ? 0 : years * 12;
  fixedMonthsInput.max = String(months || 360);
  const fixedMonths = months ? normalizeInput(fixedMonthsInput,1,months,{ integer:true }) : null;
  if (!principal || annualRate == null || floatingAnnualRate == null || !months || fixedMonths == null) {
    clearResults();
    return;
  }

  const introductoryMonthlyRate = annualRate / 100 / 12;
  const floatingMonthlyRate = floatingAnnualRate / 100 / 12;
  const introductoryPayment = annuityPayment(principal,introductoryMonthlyRate,months);
  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  let currentPayment = introductoryPayment;
  let floatingPayment = 0;
  let balanceAfterFixed = principal;
  const rows = [];

  for (let month = 1; month <= months; month += 1) {
    const floating = month > fixedMonths;
    if (month === fixedMonths + 1) {
      currentPayment = annuityPayment(balance,floatingMonthlyRate,months - fixedMonths);
      floatingPayment = currentPayment;
    }
    const appliedAnnualRate = floating ? floatingAnnualRate : annualRate;
    const monthlyRate = floating ? floatingMonthlyRate : introductoryMonthlyRate;
    const openingBalance = balance;
    const interest = openingBalance * monthlyRate;
    const principalPayment = month === months ? openingBalance : Math.min(Math.max(currentPayment - interest,0),openingBalance);
    const payment = principalPayment + interest;
    balance = Math.max(0, openingBalance - principalPayment);
    if (month === fixedMonths) balanceAfterFixed = balance;
    totalInterest += interest;
    totalPayment += payment;
    rows.push(`<tr class="${month === fixedMonths + 1 ? "is-floating-start" : ""}"><td>${month}${month === fixedMonths + 1 ? `<small>Bắt đầu thả nổi</small>` : ""}</td><td>${percentage(appliedAnnualRate)}%/năm</td><td>${currency(openingBalance)}</td><td>${currency(principalPayment)}</td><td>${currency(interest)}</td><td><b>${currency(payment)}</b></td><td>${currency(balance)}</td></tr>`);
  }

  const hasFloatingPeriod = fixedMonths < months;
  document.querySelector("#monthly-payment").textContent = currency(introductoryPayment);
  document.querySelector("#floating-payment").textContent = hasFloatingPeriod ? currency(floatingPayment) : "Không áp dụng";
  document.querySelector("#balance-after-fixed").textContent = currency(balanceAfterFixed);
  document.querySelector("#floating-start-label").textContent = hasFloatingPeriod
    ? `Sau ${fixedMonths} tháng ưu đãi · bắt đầu lãi thả nổi ${percentage(floatingAnnualRate)}%/năm từ tháng ${fixedMonths + 1}`
    : `Ưu đãi áp dụng hết ${months} tháng · không còn dư nợ để tính lãi thả nổi`;
  document.querySelector("#loan-term-label").textContent = hasFloatingPeriod
    ? `${percentage(annualRate)}%/năm trong ${fixedMonths} tháng · sau đó ${percentage(floatingAnnualRate)}%/năm`
    : `${percentage(annualRate)}%/năm trong toàn bộ ${months} tháng`;
  document.querySelector("#total-interest").textContent = currency(totalInterest);
  document.querySelector("#total-payment").textContent = currency(totalPayment);
  document.querySelector("#principal-total").textContent = currency(principal);
  scheduleBody.innerHTML = rows.join("");
}

amountInput.addEventListener("input", () => formatMoneyInput(amountInput));
form.addEventListener("input", calculate);
calculate();
