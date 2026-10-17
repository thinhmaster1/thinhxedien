# Quy tắc báo giá và khoản vay

Trạng thái cập nhật 05/10/2026. Chính sách bán hàng theo dữ liệu người dùng đã cung cấp; không phải xác nhận độc lập từ hãng.

## Giá và ưu đãi

1. Cơ sở ưu đãi = giá phiên bản + phụ phí màu đã công bố.
2. Trừ ưu đãi cố định dòng xe, rồi ưu đãi khách hàng theo base trong JSON. programPercent dùng MSRP gồm màu; base afterModel dùng cơ sở đã trừ ưu đãi dòng xe.
3. Chỉ chọn một ưu đãi khách hàng. Vì tương lai xanh 2 không đồng thời với voucher Tri ân xe xăng.
4. Trừ giảm thêm hợp lệ; không để giá xe âm. Nhập âm/vượt giới hạn thì báo lỗi và khoản giảm thêm không được áp dụng.

VF 7 và VF 8 cũ: 9% cho owner và special. VF 8 Thế hệ mới: owner 5%, special 7%. Tỷ lệ các xe khác đọc từ JSON, không hardcode ở từng trang.

| Dòng xe | Giảm thêm tối đa |
| --- | --- |
| VF 2, VF 3, EC Van, Minio Green | 6 triệu |
| VF 5 | 10 triệu |
| VF 6, Limo Green | 12 triệu |
| VF 7, VF MPV 7 | 15 triệu |
| VF 8 cũ/mới | 20 triệu |
| VF 9 | 25 triệu |

Minio chưa có xe trong danh mục hiện tại. Herio Green/VF Wild chưa có giới hạn cố định: chỉ giới hạn bởi giá xe sau ưu đãi chính sách.

## Lăn bánh

Phí dịch vụ đăng ký linh hoạt: miễn phí (0đ), 3.000.000đ mặc định hoặc 5.000.000đ. Đọc lựa chọn biểu mẫu, không dùng hằng số cố định.

Tổng lăn bánh = đăng ký biển + phí dịch vụ + đăng kiểm + đường bộ + TNDS + bảo hiểm vật chất được áp dụng.

VF 2/VF 3/EC Van: bảo hiểm vật chất cố định 4.500.000đ. Xe khác: 1,2% biển trắng hoặc 1,6% biển vàng trên giá xe sau tất cả ưu đãi, làm tròn lên 1.000đ. Vay luôn gồm bảo hiểm; trả thẳng chỉ cộng khi bật lựa chọn.

Phí biển, TNDS, đường bộ ở FEES của js/pages/quote.js. VF Wild vẫn tạm tính phân loại phí theo ghi chú đăng ký, không suy ra phân loại pháp lý từ brochure.

## Trả góp và PNG

Vay nhanh 75/80/85% giá xe sau ưu đãi; mặc định 85%. Trả trước = giá xe × (100 - tỷ lệ vay)/100, làm tròn đồng. Nhập thủ công được giới hạn từ 0 đến toàn bộ giá xe.

Dư nợ = giá xe - trả trước. Thanh toán ban đầu = trả trước + lăn bánh phương án vay. Lăn bánh không được cộng vào khoản vay. Dư nợ 0 không mở tính lãi.

Trả thẳng = giá xe + lăn bánh tiền mặt. PNG phải dùng phương thức đang chọn, phí và tiền đang hiển thị; tên file có xe, phương thức, khách/SĐT nếu nhập và ngày.

## Lãi dư nợ giảm dần

Gốc mỗi tháng = khoản vay / số tháng. Lãi kỳ = dư nợ đầu kỳ × lãi suất năm / 100 / 12. Lãi thả nổi bắt đầu tháng sau fixedMonths. Kỳ cuối trả hết dư nợ còn lại. Không làm tròn sớm từng phép tính; định dạng khi hiển thị.

Rà soát 17/10/2026: chặn số không hữu hạn, tiền vay không nguyên/ngoài 1đ–1.000 tỷ, lãi ngoài 0–100%, kỳ hạn không nguyên hoặc ngoài 1–360 tháng và kỳ ưu đãi ngoài 0–kỳ hạn. Trang nhập kỳ hạn 1–30 năm nguyên. Không tự sửa số sai thành số hợp lệ. Ưu đãi 0 tháng nghĩa là lãi thả nổi từ kỳ đầu; ưu đãi hết kỳ hạn thì không có giai đoạn thả nổi. Mức thả nổi là giả định cố định cho giai đoạn sau ưu đãi, không mô phỏng từng lần ngân hàng điều chỉnh.

Nút In lịch trả nợ chỉ bật khi kết quả hợp lệ. Bản in có ngày lập, toàn bộ đầu vào, tổng gốc/lãi và tất cả các kỳ; A4 ngang, không giới hạn vùng cuộn, lặp tiêu đề bảng. Không phải báo giá tín dụng được ngân hàng xác nhận. Các dòng và tổng làm tròn độc lập đến đồng khi hiển thị nên cộng các số đã hiển thị có thể lệch vài đồng.

Cập nhật xuất ảnh 17/10/2026: hai nút riêng cho 1 PNG tóm tắt 1080×1040 và PNG lịch trả nợ đầy đủ (36 tháng/ảnh, 60 tháng = 2 ảnh, 360 tháng = 10 ảnh). Không hiển thị khối dư nợ hết ưu đãi trên màn hình hoặc trong ảnh; bảng hàng tháng vẫn có dư nợ đầu/cuối từng kỳ. Ảnh tóm tắt gồm khoản vay, thời hạn, lãi suất ưu đãi/thả nổi, tiền trả kỳ đầu từng giai đoạn, gốc mỗi tháng và tổng gốc/lãi. Đổi đầu vào xóa liên kết cũ; ảnh lấy từ snapshot hàm tính. CSS in giấy giữ làm phương án Ctrl+P dự phòng.
