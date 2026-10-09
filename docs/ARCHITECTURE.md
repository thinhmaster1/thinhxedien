# Kiến trúc

Website tĩnh phục vụ trên GitHub Pages, dùng HTML, CSS và ES modules. package.json quản lý Playwright và lệnh kiểm thử; không có bước build bắt buộc để chạy website.

| Khu vực | Trách nhiệm |
| --- | --- |
| data/cars.json | Danh mục xe, phiên bản, giá, màu, thông số, tóm tắt và nguồn |
| data/promotions.json | Chương trình, nhóm đối tượng, tỷ lệ và ưu đãi riêng |
| js/core.js | Fetch JSON với no-cache, định dạng tiền, escape, tham số URL, nhóm thông số |
| js/components.js | Menu, footer, SEO, giao diện sáng/tối và thành phần chung |
| js/detail-content.js | Tóm tắt xe và nguồn tham chiếu |
| js/pages/*.js | Điều phối từng trang và tương tác biểu mẫu |
| js/quote-calculator.js | Ưu đãi, giảm thêm, bảo hiểm, khoản trả trước và tổng phí |
| js/quote-validation.js | Tiền nhập, ngày lập và thời hạn ưu đãi |
| js/quote-view.js | HTML biểu mẫu và kết quả; escape dữ liệu hiển thị |
| js/quote-image.js | Lấy dữ liệu phương thức đang chọn, dựng PNG và tải ảnh |
| js/loan-calculator.js | Lịch vay dư nợ giảm dần và giai đoạn thả nổi |
| js/access.js | Passcode và quyền truy cập trong sessionStorage |
| tests/*.test.mjs | Kiểm tra dữ liệu và công thức bằng Node |

Luồng dữ liệu: HTML tải module trang -> core tải JSON -> trang chọn xe/chính sách -> hàm tính toán/thành phần chung -> DOM. Báo giá PNG được dựng từ kết quả đang hiển thị trong js/pages/quote.js.

CSS tải theo base.css -> components.css -> pages.css -> refinements.css -> premium.css. premium.css có thể ghi đè refinements.css; thay đổi cần kiểm tra cả cascade và dark mode.

Đổi logic/CSS: tăng query phiên bản ở trang HTML và import phụ thuộc có thay đổi. JSON được fetch no-cache. Cổng nội bộ không giữ bí mật dữ liệu đã phát hành trên website tĩnh.
