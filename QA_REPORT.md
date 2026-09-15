# Kiểm thử giao diện — 15/09/2026

## Phạm vi

Tám trang chính: trang chủ, chi tiết xe, bảng giá, so sánh, ưu đãi, báo giá, tính vay và showroom Thủ Dầu Một. Chi tiết xe kiểm tra thêm hai mẫu VF 7 và VF MPV 7.

## Kết quả

- 54 cấu hình: 9 đường dẫn × 3 màn hình (1280×900, 390×844, 320×800) × sáng/tối. Không tràn ngang toàn trang, không ảnh lỗi hay trạng thái lỗi; mỗi trang có một tiêu đề chính hiển thị. Bảng rộng cuộn bên trong vùng riêng.
- Menu chung, đường dẫn trang, liên kết bỏ qua menu và mục điều hướng hiện tại hoạt động. Menu điện thoại mở/đóng bằng nút và Escape; hộp tư vấn mở được từ menu điện thoại và nút máy tính, đóng được mà không gửi dữ liệu.
- Bảng giá mở chi tiết phiên bản; so sánh thay, xóa và thêm xe, giữ tối đa ba thẻ.
- MPV 7: giá xe 750 triệu, không ưu đãi riêng; phí lăn bánh 5.675.000đ và trả thẳng 755.675.000đ (biển trắng, tỉnh, màu chuẩn).
- Trả góp mặc định: trả trước 112.5 triệu, vay 637.5 triệu, thanh toán ban đầu 127.175.000đ. Khi nhập trả trước 200 triệu: vay 550 triệu, thanh toán ban đầu 214.675.000đ. Chỉ một phương thức hiển thị; nút đặt lại phục hồi vay 85%.
- Phí dịch vụ đăng ký vẫn cố định 3 triệu. Limo Green giữ giảm 35 triệu đến 30/09/2026; giá sau ưu đãi 664 triệu.
- Chuyển từ báo giá sang bảng vay giữ đúng số tiền 550 triệu. Lịch 5 năm có 60 kỳ, thả nổi từ tháng 13 và dư nợ kỳ cuối bằng 0. Ca lãi suất 0% cho tổng lãi bằng 0 (dư nợ có thể chênh 1đ do quy tắc làm tròn lên hiện có).
- Nút tạo ảnh PNG hoàn tất, báo trạng thái thành công và không ghi lỗi. Hàm đặt tên file được kiểm tra với tên có dấu, số điện thoại và trường hợp không có khách hàng.
- Cú pháp toàn bộ JavaScript, dữ liệu JSON và kiểm tra khoảng trắng bản thay đổi đều đạt.

## Giới hạn

Kiểm thử trong trình duyệt nhúng trên máy local, không thay thế kiểm tra Safari/Chrome trên thiết bị thật. Trình duyệt nhúng không trả sự kiện tải file cho ảnh data-URL, nên chưa xác nhận file PNG trên ổ đĩa; chỉ xác nhận luồng tạo ảnh và tên file. Không gửi biểu mẫu Zalo, không xác minh chính sách thực tế với đại lý/ngân hàng, không thay đổi công thức tài chính hay dữ liệu giá trong lần cập nhật giao diện này.
