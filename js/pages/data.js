import { esc, fail, money, UPDATING } from "../core.js";
import { applySeo, Footer, Header } from "../components.js";

applySeo({
  title: "Bảng giá xe VinFast 2026 | Tất cả phiên bản",
  description: "Bảng giá các dòng xe điện VinFast và từng phiên bản, kèm quãng đường và số chỗ. Tư vấn tại Bình Dương: 0352 978 519.",
  canonical: "https://thinhxedien.com/data.html"
});

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

const modelRow = car => {
  const prices = car.versions.map(version => version.price).filter(Boolean);
  const lowest = prices.length ? Math.min(...prices) : 0;
  const modelLink = car.slug
    ? `<a href="detail.html?xe=${car.slug}"><strong>${esc(car.name)}</strong><span>${esc(car.use)}</span></a>`
    : `<span><strong>${esc(car.name)}</strong><span>${esc(car.use)}</span></span>`;
  return `<tr class="car-summary" data-model="${esc(car.slug || car.name)}">
    <td>${modelLink}</td><td>${esc(car.segment)}</td>
    <td><button class="version-toggle" type="button" aria-expanded="false"><span>${car.versions.length} phiên bản</span><i>+</i></button></td>
    <td class="price-cell ${lowest ? "" : "is-updating"}">${lowest ? money(lowest) : UPDATING}</td>
    <td class="${car.specs?.range ? "" : "is-updating"}">${car.specs?.range || UPDATING}</td>
    <td class="${car.specs?.seats ? "" : "is-updating"}">${car.specs?.seats || UPDATING}</td>
  </tr>
  ${car.versions.map(version => `<tr class="version-detail" hidden><td></td><td></td><td>${esc(version.name)}</td><td class="price-cell ${version.price ? "" : "is-updating"}">${version.price ? money(version.price) : UPDATING}</td><td></td><td></td></tr>`).join("")}`;
};

const printSheet = (models, updated) => `<section class="all-models-print" id="all-models-print">
  <header><div><span>THỊNH XE ĐIỆN</span><h1>Bảng giá xe VinFast</h1><p>Giá thấp nhất của từng dòng xe · Cập nhật ${esc(updated)}</p></div><aside><b>Tư vấn trực tiếp</b><strong>0352 978 519</strong></aside></header>
  <table><thead><tr><th>Dòng xe</th><th>Phân khúc</th><th>Số chỗ</th><th>Quãng đường</th><th>Giá thấp nhất</th></tr></thead><tbody>${models.map(car => {
    const prices = car.versions.map(version => version.price).filter(Boolean);
    const lowest = prices.length ? Math.min(...prices) : 0;
    return `<tr><td><b>${esc(car.name)}</b></td><td>${esc(car.segment)}</td><td>${esc(car.specs?.seats || "—")}</td><td>${esc(car.specs?.range || "—")}</td><td>${lowest ? money(lowest) : UPDATING}</td></tr>`;
  }).join("")}</tbody></table>
  <footer><p>Giá đã bao gồm VAT và pin theo dữ liệu hiện có. Giá thực tế có thể thay đổi theo phiên bản, màu sắc, thời điểm và chính sách bán hàng.</p><b>Thịnh Xe Điện · 0352 978 519</b></footer>
</section>`;

fetch("data/cars.json").then(response => {
  if (!response.ok) throw new Error("Không thể tải dữ liệu giá xe");
  return response.json();
}).then(data => {
  const models = [...data.cars, ...(data.additionalPrices || [])];
  const versionCount = models.reduce((total, car) => total + car.versions.length, 0);
  document.querySelector("#price-meta").textContent = `${models.length} dòng xe · ${versionCount} phiên bản · Cập nhật ${data.updated}`;
  document.querySelector("#price-table-body").innerHTML = models.map(modelRow).join("");
  document.querySelector("#price-print-root").innerHTML = printSheet(models, data.updated);

  document.querySelectorAll(".version-toggle").forEach(button => button.addEventListener("click", () => {
    const summary = button.closest("tr");
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.querySelector("i").textContent = open ? "+" : "−";
    let row = summary.nextElementSibling;
    while (row?.classList.contains("version-detail")) {
      row.hidden = open;
      row = row.nextElementSibling;
    }
  }));

  document.querySelector("#print-all-prices").addEventListener("click", () => {
    document.body.classList.add("printing-all-prices");
    window.addEventListener("afterprint", () => document.body.classList.remove("printing-all-prices"), { once: true });
    window.print();
  });
}).catch(fail);
