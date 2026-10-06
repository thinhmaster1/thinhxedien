import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Rebuild crawlable vehicle pages from the same source as the interactive UI.
const root = process.cwd();
const check = process.argv.includes('--check');
const site = 'https://thinhmaster1.github.io/thinhxedien';
const { cars } = JSON.parse(readFileSync(resolve(root, 'data/cars.json'), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const money = value => new Intl.NumberFormat('vi-VN').format(value) + ' đ';
function save(file, content) {
  if (check) {
    if (readFileSync(resolve(root, file), 'utf8') !== content) throw new Error(`${file}: chạy node scripts/generate-seo.mjs để cập nhật SEO`);
  } else writeFileSync(resolve(root, file), content);
}
const template = readFileSync(resolve(root, 'detail.html'), 'utf8');
for (const car of cars) {
  const url = `${site}/${car.slug}.html`;
  const title = `Giá VinFast ${car.name} tại Bình Dương | Thịnh Xe Điện`;
  const description = `VinFast ${car.name}: giá niêm yết từ ${money(Math.min(...car.versions.map(v => v.price)))}. Xem phiên bản, kích thước, pin và thông số; tư vấn tại Thủ Dầu Một: 0352 978 519.`;
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':['Product','Car'],'@id':`${url}#vehicle`,name:`VinFast ${car.name}`,url,image:[`${site}/${car.image}`],description,brand:{'@type':'Brand',name:'VinFast'},offers:{'@type':'AggregateOffer',priceCurrency:'VND',lowPrice:Math.min(...car.versions.map(v=>v.price)),highPrice:Math.max(...car.versions.map(v=>v.price)),offerCount:car.versions.length,url}},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Thịnh Xe Điện',item:`${site}/index.html`},{'@type':'ListItem',position:2,name:car.name,item:url}]}
  ]};
  const meta = `<link rel="canonical" href="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="product"><meta property="og:image" content="${site}/${esc(car.image)}"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thịnh Xe Điện"><meta name="twitter:card" content="summary_large_image"><script id="vehicle-schema" type="application/ld+json">${json(schema)}</script>`;
  const specs = [['Kích thước', 'dimensions'], ['Số chỗ','seats'], ['Dung lượng pin','battery'], ['Quãng đường công bố','range'], ['Khoang hành lý','trunk'], ['Công suất','power']];
  const body = `<section class="product-intro"><div class="product-intro__copy"><span>${esc(car.segment)}</span><h1>${esc(car.name)}</h1><p>${esc(car.summary?.description || car.tagline)}</p><strong>Giá niêm yết từ ${money(Math.min(...car.versions.map(v=>v.price)))}</strong><p>Giá tham khảo theo dữ liệu hiện có; ưu đãi và cấu hình cần xác nhận khi đặt xe.</p><a href="policies.html">Xem chính sách ưu đãi</a></div><div class="product-intro__visual is-thumbnail"><img src="${esc(car.image)}" alt="VinFast ${esc(car.name)}" fetchpriority="high"></div></section><section class="spec-section"><h2>Tóm tắt ${esc(car.name)}</h2><dl>${specs.filter(([,key])=>car.specs[key]).map(([label,key])=>`<dt>${label}</dt><dd>${esc(car.specs[key])}</dd>`).join('')}</dl><h2>Phiên bản và giá niêm yết</h2><ul>${car.versions.map(v=>`<li>${esc(v.name)}: ${money(v.price)}</li>`).join('')}</ul><h2>Nguồn thông tin</h2><ul>${(car.sources || []).map(s=>`<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`).join('')}</ul><p><a href="index.html">Các dòng xe VinFast</a> · <a href="vinfast-thu-dau-mot-binh-duong.html">Tư vấn tại Thủ Dầu Một</a></p></section>`;
  save(`${car.slug}.html`, template.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`).replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`).replace('</head>',`${meta}</head>`).replace(/<main id="detail-root">[\s\S]*?<\/main>/, `<main id="detail-root" data-car-slug="${car.slug}">${body}</main>`));
}
const pages = ['index.html','vinfast-thu-dau-mot-binh-duong.html','data.html','compare.html','policies.html', ...cars.map(c=>`${c.slug}.html`)];
const indexFile = readFileSync(resolve(root, 'index.html'), 'utf8');
const directory = `<noscript id="vehicle-directory"><section class="spec-section"><h2>Các dòng xe VinFast</h2><ul>${cars.map(car=>`<li><a href="${car.slug}.html">${esc(car.name)} — giá niêm yết từ ${money(Math.min(...car.versions.map(v=>v.price)))}</a></li>`).join('')}</ul></section></noscript>`;
save('index.html', indexFile.replace(/<noscript id="vehicle-directory">[\s\S]*?<\/noscript>/, '').replace('</main>', `${directory}</main>`));
save('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page=>`  <url><loc>${site}/${page}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`SEO: ${cars.length} vehicle pages and sitemap ${check ? 'verified' : 'generated'}.`);
