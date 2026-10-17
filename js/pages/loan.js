import { applySeo, mountSiteShell } from '../components.js?v=2026100501';
import { formatMoneyInput, money } from '../core.js?v=2026091903';
import { calculateDecliningBalanceSchedule } from '../loan-calculator.js?v=2026101701';
import { createLoanImages } from '../loan-image.js?v=2026101703';

applySeo({ title:'Tính lãi vay dư nợ giảm dần | Thịnh Xe Điện', canonical:'https://thinhmaster1.github.io/thinhxedien/loan.html' });
mountSiteShell();
const form = document.querySelector('#loan-form');
const input = id => document.querySelector(`#loan-${id}`);
const amountInput = input('amount');
const printButton = document.querySelector('#print-loan');
const body = document.querySelector('#loan-schedule-body');
const exportStatus = document.querySelector('#loan-export-status');
const exportLinks = document.querySelector('#loan-export-links');
let currentPlan = null;
let revision = 0;
let urls = [];
function invalidateImages() {
  revision++;
  urls.forEach(url=>URL.revokeObjectURL(url)); urls=[];
  exportLinks.replaceChildren(); exportStatus.textContent='';
  printButton.textContent='Tải ảnh tóm tắt';
}
const set = (id,value) => { document.getElementById(id).textContent = value; };
const currency = value => money(Math.round(value));
const percent = value => new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(value);
const transferred = new URLSearchParams(location.search).get('amount');
if (transferred !== null) amountInput.value = transferred;
const validAmountSyntax = value => /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value.trim());
if (validAmountSyntax(amountInput.value)) formatMoneyInput(amountInput);

function clearResults(message) {
  currentPlan=null;
  for (const id of ['monthly-payment','floating-payment','balance-after-fixed','loan-term-label','total-interest','total-payment','principal-total']) set(id,'—');
  set('floating-start-label','Nhập thông tin hợp lệ để xem kết quả.');
  set('loan-error',message);
  set('loan-print-summary','Chưa có dữ liệu hợp lệ để in.');
  body.innerHTML = '<tr><td colspan="7" class="loan-empty-row">Chưa có lịch trả nợ hợp lệ.</td></tr>';
  printButton.disabled = true;
  return false;
}

function calculate() {
  invalidateImages();
  const fields = [amountInput,input('rate'),input('floating-rate'),input('fixed-months'),input('years')];
  fields.forEach(field => field.setAttribute('aria-invalid','false'));
  const principal = Number(amountInput.value.replaceAll(',',''));
  document.body.classList.toggle('is-large-loan',Number.isFinite(principal) && principal>=1e10);
  const annualRate = Number(input('rate').value);
  const floatingAnnualRate = Number(input('floating-rate').value);
  const years = Number(input('years').value);
  const months = years * 12;
  const fixedMonths = Number(input('fixed-months').value);
  const invalid = [
    !validAmountSyntax(amountInput.value) || !Number.isSafeInteger(principal) || principal <= 0 || principal > 1e12,
    !input('rate').value.trim() || !Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100,
    !input('floating-rate').value.trim() || !Number.isFinite(floatingAnnualRate) || floatingAnnualRate < 0 || floatingAnnualRate > 100,
    !input('fixed-months').value.trim() || !Number.isInteger(fixedMonths) || fixedMonths < 0 || fixedMonths > months,
    !input('years').value.trim() || !Number.isInteger(years) || years < 1 || years > 30
  ];
  invalid.forEach((bad,index) => fields[index].setAttribute('aria-invalid',String(bad)));
  if (invalid.some(Boolean)) return clearResults('Vui lòng kiểm tra ô đánh dấu: tiền vay từ 1đ đến 1.000 tỷ; lãi 0–100%; thời hạn 1–30 năm nguyên; ưu đãi từ 0 đến tổng số tháng vay.');
  let schedule;
  try { schedule = calculateDecliningBalanceSchedule({principal,annualRate,floatingAnnualRate,months,fixedMonths}); }
  catch { return clearResults('Không thể tính với dữ liệu hiện tại. Vui lòng kiểm tra lại.'); }
  const floating = fixedMonths < months;
  set('loan-error','');
  set('monthly-payment',fixedMonths ? currency(schedule.introductoryFirstPayment) : 'Không áp dụng');
  set('floating-payment',floating ? currency(schedule.floatingFirstPayment) : 'Không áp dụng');
  set('balance-after-fixed',currency(schedule.balanceAfterFixed));
  set('floating-start-label',floating ? `${fixedMonths ? `Hết tháng ${fixedMonths}` : 'Không có kỳ ưu đãi'} · còn ${currency(schedule.balanceAfterFixed)} · áp dụng ${percent(floatingAnnualRate)}%/năm từ tháng ${fixedMonths+1}.` : `Ưu đãi suốt ${months} tháng; cuối kỳ hết dư nợ, không có giai đoạn thả nổi.`);
  set('loan-term-label',`Gốc chia đều ${currency(schedule.regularPrincipal)}/tháng. Lãi kỳ = dư nợ đầu kỳ × lãi suất năm / 12.`);
  set('total-interest',currency(schedule.totalInterest));
  set('total-payment',currency(schedule.totalPayment));
  set('principal-total',currency(principal));
  body.innerHTML = schedule.rows.map(row => `<tr class="${row.month===fixedMonths+1 ? 'is-floating-start' : ''}"><td>${row.month}${row.month===fixedMonths+1 ? '<small>Bắt đầu thả nổi</small>' : ''}</td><td>${percent(row.appliedAnnualRate)}%/năm</td><td>${currency(row.openingBalance)}</td><td>${currency(row.principalPayment)}</td><td>${currency(row.interest)}</td><td><b>${currency(row.payment)}</b></td><td>${currency(row.balance)}</td></tr>`).join('');
  set('loan-print-summary',`Ngày lập ${new Intl.DateTimeFormat('vi-VN').format(new Date())} · Vay ${currency(principal)} · Thời hạn ${years} năm (${months} tháng) · Ưu đãi ${percent(annualRate)}%/năm trong ${fixedMonths} tháng · Thả nổi giả định ${percent(floatingAnnualRate)}%/năm ${floating ? `từ tháng ${fixedMonths+1}` : '(không áp dụng)'}. Phương pháp: gốc chia đều, lãi dư nợ giảm dần.`);
  currentPlan={principal,annualRate,floatingAnnualRate,months,fixedMonths,schedule};
  printButton.disabled = false;
  return true;
}
amountInput.addEventListener('input',()=> { if (validAmountSyntax(amountInput.value)) formatMoneyInput(amountInput); });
form.addEventListener('input',calculate);
form.addEventListener('submit',event=>event.preventDefault());
printButton.addEventListener('click',async ()=> {
  if (!calculate()) return;
  const version=revision;
  printButton.disabled=true; printButton.textContent='Đang tạo ảnh…';
  exportStatus.textContent='Đang dựng toàn bộ lịch trả nợ thành PNG.';
  try {
    const pages = await createLoanImages(currentPlan);
    if (version!==revision) return;
    pages.forEach((page,index)=>{
      const url=URL.createObjectURL(page.blob); urls.push(url);
      const link=document.createElement('a'); link.href=url; link.download=page.fileName;
      link.textContent='Tải lại ảnh tóm tắt (PNG)';
      link.className='loan-image-download'; exportLinks.append(link);
    });
    exportStatus.textContent='Đã tạo 1 ảnh tóm tắt. Lịch từng tháng xem ở cuối trang.';
    if (pages.length===1) exportLinks.querySelector('a').click();
    exportLinks.scrollIntoView({behavior:'smooth',block:'nearest'});
  } catch { if (version===revision) exportStatus.textContent='Không thể tạo ảnh. Vui lòng thử lại.'; }
  finally { if (version===revision) {printButton.disabled=false;printButton.textContent='Tải ảnh tóm tắt';} }
});
let detailsWereOpen=false;
window.addEventListener('beforeprint',()=>{calculate();const details=document.querySelector('#loan-details');detailsWereOpen=details.open;details.open=true;});
window.addEventListener('afterprint',()=>{document.querySelector('#loan-details').open=detailsWereOpen;});
calculate();
