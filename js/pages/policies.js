import { esc, fail, loadPromotions } from "../core.js?v=2026091903";
import { applySeo, mountSiteShell } from "../components.js?v=2026091903";

applySeo({
  title: "Khuyến mãi VinFast tháng 9/2026 | Thịnh Xe Điện",
  description: "Chương trình Vì tương lai xanh 2 và các ưu đãi VinFast đang áp dụng. Liên hệ tư vấn tại Thủ Dầu Một, Bình Dương: 0352 978 519.",
  canonical: "https://thinhmaster1.github.io/thinhxedien/policies.html"
});

mountSiteShell();
const percent = rate => `${new Intl.NumberFormat("vi-VN",{ maximumFractionDigits:1 }).format(Number(rate) * 100)}%`;

loadPromotions().then(data => {
  document.querySelector("#policy-date").textContent = `BẢN TIN CHÍNH SÁCH · ${data.updated}`;
  document.querySelector("#policy-note-date").textContent = data.updated;
  const futureGreen = data.futureGreen2;
  document.querySelector("#future-green-2").innerHTML = `<div class="future-green-policy__head"><div><span>${esc(futureGreen.label)}</span><h2>${esc(futureGreen.title)}</h2><p>${esc(futureGreen.summary)}</p></div><aside><span>THỜI GIAN ÁP DỤNG</span><strong>${esc(futureGreen.period)}</strong><p>Tính theo ngày xuất hóa đơn.</p></aside></div><div class="future-green-groups">${futureGreen.groups.map(group => `<article><div><span>NHÓM KHÁCH HÀNG</span><h3>${esc(group.name)}</h3><p>${esc(group.description)}</p></div><div class="future-green-tiers">${group.tiers.map(tier => `<div><strong>${esc(percent(tier.rate))}</strong><span>${esc(tier.label)}</span></div>`).join("")}</div></article>`).join("")}</div><div class="future-green-conditions"><div><h3>Điều kiện chính</h3><ul>${futureGreen.conditions.map(item => `<li>${esc(item)}</li>`).join("")}</ul></div><div><h3>Không áp dụng đồng thời</h3><ul>${futureGreen.exclusions.map(item => `<li>${esc(item)}</li>`).join("")}</ul><small>${esc(futureGreen.source)}</small></div></div>`;
  document.querySelector("#active-promotions").innerHTML = data.active.map(item => `<article class="policy-card ${item.highlight ? "is-highlight" : ""}"><span>${esc(item.period)}</span><h3>${esc(item.model)}</h3><strong>${esc(item.benefit)}</strong><p>${esc(item.description)}</p></article>`).join("");
  document.querySelector("#legacy-promotions").innerHTML = data.legacy.map(item => `<article><div><h3>${esc(item.name)}</h3></div><p>${esc(item.description)}</p></article>`).join("");
}).catch(fail);
