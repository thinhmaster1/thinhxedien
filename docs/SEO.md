# SEO Google

Các trang xe `vf-7.html`, `vf-wild-comfort.html`… chứa tiêu đề, mô tả, canonical, giá niêm yết, tóm tắt, nguồn và JSON-LD ngay trong HTML. JavaScript tiếp tục bổ sung giao diện tương tác. URL cũ `detail.html?xe=...` vẫn hoạt động và canonical trỏ về trang xe riêng.

Sau khi sửa cars.json hoặc detail.html, chạy `node scripts/generate-seo.mjs`. Không chỉnh giá trực tiếp trong HTML sinh tự động. `node scripts/generate-seo.mjs --check` phát hiện nội dung SEO chưa đồng bộ; chạy kiểm tra này trước phát hành.

Sitemap chỉ chứa trang công khai và URL canonical. Không khai báo ngày cập nhật giả hoặc tình trạng còn hàng chưa xác nhận. Các công cụ nội bộ và trang demo dùng noindex; đây không phải cơ chế bảo mật.

Sau khi push và xác nhận GitHub Pages đã phát hành: chủ website xác minh quyền sở hữu Google Search Console, gửi sitemap.xml và kiểm tra URL trang chủ, VF Wild, VF 7. Kiểm tra Product bằng Rich Results Test. Google quyết định việc lập chỉ mục và hiển thị kết quả nâng cao; không bảo đảm vị trí xếp hạng.

Hướng dẫn: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
