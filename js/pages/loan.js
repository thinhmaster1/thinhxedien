import { applySeo, Footer, Header } from "../components.js";
import { money } from "../core.js";
import { setupPrivateAccess } from "../access.js";

applySeo({
  title: "Tính lãi suất vay mua xe & dư nợ trả góp",
  description: "Nhập số tiền vay, lãi suất và thời hạn để xem khoản trả hàng tháng, tổng lãi cùng lịch dư nợ chi tiết.",
  canonical: "https://thinhxedien.com/loan.html"
});

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();
setupPrivateAccess({ gateId: "loan-gate", formId: "loan-gate-form", inputId: "loan-passcode", errorId: "loan-gate-error" });

const form = document.querySelector("#loan-form");
const currency = value => money(value);
const transferredAmount = Number(new URLSearchParams(location.search).get("amount"));
if (Number.isFinite(transferredAmount) && transferredAmount > 0) document.querySelector("#loan-amount").value = String(Math.ceil(transferredAmount));

function calculate() {
  const principal = Math.max(0, Number(document.querySelector("#loan-amount").value) || 0);
  const rateInput = document.querySelector("#loan-rate");
  const annualRate = Math.max(0, Number(rateInput.value) || 0);
  const years = Math.max(0, Number(document.querySelector("#loan-years").value) || 0);
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  if (!principal || !months) return;

  const fixedPayment = monthlyRate === 0 ? principal / months : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  const rows = [];

  for (let month = 1; month <= months; month += 1) {
    const openingBalance = balance;
    const interest = openingBalance * monthlyRate;
    const principalPayment = month === months ? openingBalance : Math.min(fixedPayment - interest, openingBalance);
    const payment = principalPayment + interest;
    balance = Math.max(0, openingBalance - principalPayment);
    totalInterest += interest;
    totalPayment += payment;
    rows.push(`<tr><td>${month}</td><td>${currency(openingBalance)}</td><td>${currency(principalPayment)}</td><td>${currency(interest)}</td><td><b>${currency(payment)}</b></td><td>${currency(balance)}</td></tr>`);
  }

  document.querySelector("#monthly-payment").textContent = currency(fixedPayment);
  document.querySelector("#loan-term-label").textContent = `${months} tháng · Lãi suất ${rateInput.value || "0"}%/năm`;
  document.querySelector("#total-interest").textContent = currency(totalInterest);
  document.querySelector("#total-payment").textContent = currency(totalPayment);
  document.querySelector("#principal-total").textContent = currency(principal);
  document.querySelector("#loan-schedule-body").innerHTML = rows.join("");
}

form.addEventListener("input", calculate);
calculate();
