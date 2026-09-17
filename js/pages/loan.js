import { applySeo, mountSiteShell } from "../components.js?v=2026091503";
import { formatMoneyInput, money, moneyInputValue } from "../core.js?v=2026091503";
import { calculateDecliningBalanceSchedule } from "../loan-calculator.js?v=2026091701";

applySeo({
  title: "Tính lãi suất vay mua xe & dư nợ trả góp",
  description: "Nhập số tiền vay, lãi suất và thời hạn để xem khoản trả hàng tháng, tổng lãi cùng lịch dư nợ chi tiết.",
  canonical: "https://thinhmaster1.github.io/thinhxedien/loan.html"
});

mountSiteShell();

const form = document.querySelector("#loan-form");
const currency = value => money(Math.round(value));
const amountInput = document.querySelector("#loan-amount");
const rateInput = document.querySelector("#loan-rate");
const floatingRateInput = document.querySelector("#loan-floating-rate");
const fixedMonthsInput = document.querySelector("#loan-fixed-months");
const yearsInput = document.querySelector("#loan-years");
const scheduleBody = document.querySelector("#loan-schedule-body");
const transferredAmount = Number(new URLSearchParams(location.search).get("amount"));
if (Number.isFinite(transferredAmount) && transferredAmount > 0) amountInput.value = String(Math.ceil(transferredAmount));
formatMoneyInput(amountInput);

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

  const schedule = calculateDecliningBalanceSchedule({ principal, annualRate, floatingAnnualRate, months, fixedMonths });
  const rows = schedule.rows.map(row => `<tr class="${row.month === fixedMonths + 1 ? "is-floating-start" : ""}"><td>${row.month}${row.month === fixedMonths + 1 ? `<small>Bắt đầu thả nổi</small>` : ""}</td><td>${percentage(row.appliedAnnualRate)}%/năm</td><td>${currency(row.openingBalance)}</td><td>${currency(row.principalPayment)}</td><td>${currency(row.interest)}</td><td><b>${currency(row.payment)}</b></td><td>${currency(row.balance)}</td></tr>`);

  const hasFloatingPeriod = fixedMonths < months;
  document.querySelector("#monthly-payment").textContent = currency(schedule.introductoryFirstPayment);
  document.querySelector("#floating-payment").textContent = hasFloatingPeriod ? currency(schedule.floatingFirstPayment) : "Không áp dụng";
  document.querySelector("#balance-after-fixed").textContent = currency(schedule.balanceAfterFixed);
  document.querySelector("#floating-start-label").textContent = hasFloatingPeriod
    ? `Sau ${fixedMonths} tháng ưu đãi · bắt đầu lãi thả nổi ${percentage(floatingAnnualRate)}%/năm từ tháng ${fixedMonths + 1}`
    : `Ưu đãi áp dụng hết ${months} tháng · không còn dư nợ để tính lãi thả nổi`;
  document.querySelector("#loan-term-label").textContent = hasFloatingPeriod
    ? `Gốc chia đều ${currency(schedule.regularPrincipal)}/tháng · lãi ${percentage(annualRate)}% rồi ${percentage(floatingAnnualRate)}%/năm trên dư nợ còn lại`
    : `Gốc chia đều ${currency(schedule.regularPrincipal)}/tháng · lãi ${percentage(annualRate)}%/năm trên dư nợ còn lại`;
  document.querySelector("#total-interest").textContent = currency(schedule.totalInterest);
  document.querySelector("#total-payment").textContent = currency(schedule.totalPayment);
  document.querySelector("#principal-total").textContent = currency(principal);
  scheduleBody.innerHTML = rows.join("");
}

amountInput.addEventListener("input", () => formatMoneyInput(amountInput));
form.addEventListener("input", calculate);
calculate();
