# Hướng dẫn dữ liệu

## Xe và phiên bản

Sửa data/cars.json, giữ slug và quan hệ URL. car.price là giá thấp nhất trong versions. Phiên bản lưu name và price, phụ phí màu ở colorPrices. Giá niêm yết không trừ ưu đãi trước.

summary có audience, description, ba highlights và charging. specs chứa thông số hiển thị theo nhóm js/core.js. Giá trị có đơn vị và chuẩn đo: không biến NEDC thành WLTP hoặc xem dung lượng khả dụng là tổng dung lượng.

Mục thiếu căn cứ để trống hoặc không khai báo. Màu thiếu phụ phí: ghi pendingColorPrices và colorNote; không tự cho miễn phí. Brochure không nêu phiên bản phải ghi giới hạn khi dùng cho bản Comfort.

## Nguồn

Ưu tiên tài liệu người dùng yêu cầu áp dụng, brochure và trang chính thức phù hợp phiên bản. Lưu specsUpdated là ngày rà soát, specsSource là tên nguồn, specsNote là chênh lệch/giới hạn. sources chỉ chứa URL HTTPS được xác nhận; không đoán URL tài liệu.

Tài liệu PDF nằm ngoài repo cần ghi tên đầy đủ trong DATA_SOURCES.md; không đưa đường dẫn cá nhân lên trang và không tự sao chép PDF vào repo. Tách ngày giá/màu/chính sách khỏi ngày thông số.

## Chính sách

Sửa data/promotions.json. Vì tương lai xanh 2 dùng groups -> tiers; bậc có carSlugs được xét trước bậc default. Nhóm owner và special có thể khác tỷ lệ. Hiện VF 7 và VF 8 cũ cùng 9%; VF 8 Thế hệ mới vẫn 5%/7%.

Ghi thời hạn và điều kiện áp dụng. Không tự gia hạn chính sách hết hạn. Trường period hiện phục vụ hiển thị; không mặc định bộ tính đã tự kiểm tra thời hạn.

Sau cập nhật kiểm tra tất cả nơi dùng dữ liệu: danh mục, chi tiết, so sánh, bảng giá, chính sách và báo giá. Chạy kiểm thử phù hợp và cập nhật DATA_SOURCES.md nếu nguồn/giới hạn thay đổi.
