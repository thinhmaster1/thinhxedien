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
const transferredAmount = Number(new URLSearchParams(location.search).get("amount"));
if (Number.isFinite(transferredAmount) && transferredAmount > 0) amountInput.value = String(Math.ceil(transferredAmount));
formatMoneyInput(amountInput);

const annuityPayment = (principal, monthlyRate, months) => {
  if (!months) return 0;
  return monthlyRate === 0 ? principal / months : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
};

function calculate() {
  const principal = moneyInputValue(amountInput.value);
  const rateInput = document.querySelector("#loan-rate");
  const floatingRateInput = document.querySelector("#loan-floating-rate");
  const fixedMonthsInput = document.querySelector("#loan-fixed-months");
  const annualRate = Math.max(0, Number(rateInput.value) || 0);
  const floatingAnnualRate = Math.max(0, Number(floatingRateInput.value) || 0);
  const years = Math.max(0, Number(document.querySelector("#loan-years").value) || 0);
  const months = Math.round(years * 12);
  if (!principal || !months) return;

  const fixedMonths = Math.min(months,Math.max(1,Math.round(Number(fixedMonthsInput.value) || 1)));
  fixedMonthsInput.max = String(months);
  const introductoryMonthlyRate = annualRate / 100 / 12;
  const floatingMonthlyRate = floatingAnnualRate / 100 / 12;
  const introductoryPayment = annuityPayment(principal,introductoryMonthlyRate,months);
  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  let currentPayment = introductoryPayment;
  let floatingPayment = 0;
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
    totalInterest += interest;
    totalPayment += payment;
    rows.push(`<tr class="${month === fixedMonths + 1 ? "is-floating-start" : ""}"><td>${month}${month === fixedMonths + 1 ? `<small>Bắt đầu thả nổi</small>` : ""}</td><td>${new Intl.NumberFormat("vi-VN",{ maximumFractionDigits:2 }).format(appliedAnnualRate)}%/năm</td><td>${currency(openingBalance)}</td><td>${currency(principalPayment)}</td><td>${currency(interest)}</td><td><b>${currency(payment)}</b></td><td>${currency(balance)}</td></tr>`);
  }

  document.querySelector("#monthly-payment").textContent = currency(introductoryPayment);
  document.querySelector("#floating-payment").textContent = fixedMonths < months ? currency(floatingPayment) : "Không áp dụng";
  document.querySelector("#loan-term-label").textContent = fixedMonths < months
    ? `${annualRate}%/năm trong ${fixedMonths} tháng · sau đó ${floatingAnnualRate}%/năm`
    : `${annualRate}%/năm trong toàn bộ ${months} tháng`;
  document.querySelector("#total-interest").textContent = currency(totalInterest);
  document.querySelector("#total-payment").textContent = currency(totalPayment);
  document.querySelector("#principal-total").textContent = currency(principal);
  document.querySelector("#loan-schedule-body").innerHTML = rows.join("");
}

amountInput.addEventListener("input", () => formatMoneyInput(amountInput));
form.addEventListener("input", calculate);
calculate();
