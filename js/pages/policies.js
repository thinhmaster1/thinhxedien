import { esc, fail } from "../core.js";
import { applySeo, Footer, Header } from "../components.js";

applySeo({
  title: "Khuyến mãi VinFast tháng 8/2026 | Thịnh Xe Điện",
  description: "Tổng hợp ưu đãi VinFast và quyền lợi VinClub đang áp dụng. Liên hệ tư vấn tại Thủ Dầu Một, Bình Dương: 0352 978 519.",
  canonical: "https://thinhxedien.com/policies.html"
});

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

fetch("data/promotions.json").then(response => {
  if (!response.ok) throw new Error("Không thể tải dữ liệu khuyến mãi");
  return response.json();
}).then(data => {
  document.querySelector("#policy-date").textContent = `BẢN TIN CHÍNH SÁCH · ${data.updated}`;
  const vinclub = data.vinclub;
  document.querySelector("#vinclub-promo").innerHTML = `<div class="vinclub-promo__head"><div><span>${esc(vinclub.label)}</span><h2>${esc(vinclub.title)}</h2></div><div><b>${esc(vinclub.period)}</b><p>${esc(vinclub.condition)}</p></div></div><div class="vinclub-tiers">${vinclub.tiers.map(tier => `<article class="${tier.featured ? "is-featured" : ""}"><span>${esc(tier.name)}</span><strong>${esc(tier.total)}</strong><p><b>${esc(tier.discount)}</b><small>${esc(tier.points)}</small></p></article>`).join("")}</div><p class="vinclub-promo__note">${esc(vinclub.note)}</p>`;
  document.querySelector("#active-promotions").innerHTML = data.active.map(item => `<article class="policy-card ${item.highlight ? "is-highlight" : ""}"><span>${esc(item.period)}</span><h3>${esc(item.model)}</h3><strong>${esc(item.benefit)}</strong><p>${esc(item.description)}</p></article>`).join("");
  document.querySelector("#legacy-promotions").innerHTML = data.legacy.map(item => `<article><div><h3>${esc(item.name)}</h3></div><p>${esc(item.description)}</p></article>`).join("");
}).catch(fail);
