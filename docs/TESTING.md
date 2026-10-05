# Kiểm tra

Chạy từ thư mục repo, với Node hỗ trợ ES modules:

```sh
node tests/run-tests.mjs
```

Lệnh trên chạy kiểm tra dữ liệu, tài chính và website. GitHub Actions chạy cùng lệnh trên push main và pull request. Bộ website kiểm tra HTML, tài nguyên/liên kết nội bộ, cú pháp/import JavaScript và HTTP của các trang/JSON; không chạy JavaScript trang trong trình duyệt và không kiểm tra bố cục responsive.

Có thể chạy riêng:

```sh
node tests/car-data.test.mjs
node tests/finance-calculators.test.mjs
node tests/website.test.mjs
node --check js/pages/quote.js
git diff --check
```

Kiểm tra dữ liệu dùng bài car-data; thay công thức dùng bài finance. Kiểm tra cú pháp module đã sửa. Không cần tạo test chỉ để khớp chữ trong tài liệu.

Chạy xem trước bằng `python3 -m http.server 4173 --bind 127.0.0.1`; mở http://127.0.0.1:4173/quote.html. Nếu công cụ khóa, dùng luồng passcode được chủ repo cung cấp, không thay cơ chế truy cập để thử.

## Ca nghiệp vụ

- VF 2 giá 188 triệu, màu chuẩn, không ưu đãi, tỉnh/biển trắng: phí không kể dịch vụ là 2.325.000đ. Lăn bánh tiền mặt ở mức dịch vụ 0/3/5 triệu: 2.325.000/5.325.000/7.325.000đ.
- Vay VF 2 mặc định 85%: trả trước 28.200.000đ, dư nợ 159.800.000đ; gồm bảo hiểm 4,5 triệu, thanh toán ban đầu 35.025.000/38.025.000/40.025.000đ theo ba mức phí.
- VF 7 Eco 740 triệu, không phụ phí màu: cả hai nhóm Vì tương lai xanh 2 giảm 66.600.000đ (9%), giá sau ưu đãi 673.400.000đ trước giảm thêm.
- Chọn 75/80/85%, nhập tiền thủ công, đổi xe/màu/chính sách, nhập giảm thêm quá mức và trả trước toàn bộ giá xe.
- Khoản vay 500 triệu/60 tháng, 8,5% trong 12 tháng rồi 11,5%: kỳ đầu khoảng 11.875.000đ, hết tháng 12 dư nợ 400 triệu; kỳ 13 khoảng 12.166.667đ, cuối kỳ về 0.

## Giao diện và xuất ảnh

### Test bố cục tự động

```sh
npm install
npx playwright install chromium
npm run test:layout
```

Playwright kiểm tra 8 trang chính ở 320/390/768/1280px, cả sáng/tối; tràn ngang toàn trang, số tiền/nút bị cắt, nhãn và số tiền chồng nhau, lỗi JavaScript và ảnh đã tải bị lỗi. Báo giá thử tên dài, phí 0/3/5 triệu, tỷ lệ vay 75/80/85%, giảm thêm vượt mức và trả trước toàn bộ. Menu di động kiểm tra mở/đóng bằng Escape.

Ảnh từng trang được đính kèm báo cáo `playwright-report/`; lỗi có screenshot và trace ở `test-results/`. Hai thư mục không commit. GitHub Actions lưu báo cáo 7 ngày. Bộ test chưa so sánh pixel với ảnh chuẩn và chưa xác minh PNG báo giá tải xuống; không tạo baseline từ ảnh chưa được duyệt.

Kiểm tra trang bị ảnh hưởng ở 320/390/1280px, sáng/tối: không tràn toàn trang, số tiền không cắt, bảng rộng cuộn nội bộ, nhãn/radio/nút bấm dùng được. Menu, chuyển trả thẳng/trả góp và kiểm tra dữ liệu nhập bằng bàn phím.

Tải PNG với phí 0/3/5 triệu: đúng phương thức, tổng và dòng phí; tên khách có dấu/SĐT và trường trống. Xác nhận file thực tế nếu công cụ hỗ trợ; ghi rõ nếu mới kiểm tra luồng tạo ảnh.

QA_REPORT.md là lịch sử có ngày. Không ghi đã kiểm tra UI, tải ảnh hoặc website live nếu chỉ chạy test Node.
