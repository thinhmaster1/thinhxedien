# Kiểm thử giao diện — 15/09/2026

## Phạm vi

Tám trang chính: trang chủ, chi tiết xe, bảng giá, so sánh, ưu đãi, báo giá, tính vay và showroom Thủ Dầu Một. Chi tiết xe kiểm tra thêm hai mẫu VF 7 và VF MPV 7.

## Kết quả

- 54 cấu hình: 9 đường dẫn × 3 màn hình (1280×900, 390×844, 320×800) × sáng/tối. Không tràn ngang toàn trang, không ảnh lỗi hay trạng thái lỗi; mỗi trang có một tiêu đề chính hiển thị. Bảng rộng cuộn bên trong vùng riêng.
- Menu chung, đường dẫn trang, liên kết bỏ qua menu và mục điều hướng hiện tại hoạt động. Menu điện thoại mở/đóng bằng nút và Escape; hộp tư vấn mở được từ menu điện thoại và nút máy tính, đóng được mà không gửi dữ liệu.
- Bảng giá mở chi tiết phiên bản; so sánh thay, xóa và thêm xe, giữ tối đa ba thẻ.
- MPV 7: giá xe 750 triệu, không ưu đãi riêng; phí lăn bánh 5.675.000đ và trả thẳng 755.675.000đ (biển trắng, tỉnh, màu chuẩn).
- Trả góp mặc định: trả trước 112.5 triệu, vay 637.5 triệu, thanh toán ban đầu 127.175.000đ. Khi nhập trả trước 200 triệu: vay 550 triệu, thanh toán ban đầu 214.675.000đ. Chỉ một phương thức hiển thị; nút đặt lại phục hồi vay 85%.
- Phí dịch vụ đăng ký vẫn cố định 3 triệu. Chính sách giảm giá riêng của Limo Green và EC Van đã được gỡ; báo giá hai xe dùng giá niêm yết trước các ưu đãi khách hàng đủ điều kiện.
- Chuyển từ báo giá sang bảng vay giữ đúng số tiền 550 triệu. Lịch 5 năm có 60 kỳ, thả nổi từ tháng 13 và dư nợ kỳ cuối bằng 0. Ca lãi suất 0% cho tổng lãi bằng 0 (dư nợ có thể chênh 1đ do quy tắc làm tròn lên hiện có).
- Nút tạo ảnh PNG hoàn tất, báo trạng thái thành công và không ghi lỗi. Hàm đặt tên file được kiểm tra với tên có dấu, số điện thoại và trường hợp không có khách hàng.
- Cú pháp toàn bộ JavaScript, dữ liệu JSON và kiểm tra khoảng trắng bản thay đổi đều đạt.

## Giới hạn

Kiểm thử trong trình duyệt nhúng trên máy local, không thay thế kiểm tra Safari/Chrome trên thiết bị thật. Trình duyệt nhúng không trả sự kiện tải file cho ảnh data-URL, nên chưa xác nhận file PNG trên ổ đĩa; chỉ xác nhận luồng tạo ảnh và tên file. Không gửi biểu mẫu Zalo, không xác minh chính sách thực tế với đại lý/ngân hàng, không thay đổi công thức tài chính hay dữ liệu giá trong lần cập nhật giao diện này.

## Vì tương lai xanh 2 — 20/09/2026

- Đối chiếu thông báo VinFast ngày 19/09/2026: nhóm chủ xe đủ điều kiện áp dụng 3%/5%/9% MSRP; nhóm Công an, Quân đội và nhân sự VNPost áp dụng 6%/7%/9% MSRP theo dòng xe, từ 19/09 đến hết 19/12/2026.
- Báo giá tự đổi tỷ lệ khi đổi dòng xe. Đã kiểm tra toàn bộ 13 mẫu xe trong dữ liệu đều vào đúng một bậc ưu đãi.
- Ca VF 2 giá 188 triệu: nhóm chủ xe giảm 3%, tương đương 5,64 triệu; giá xe sau ưu đãi 182,36 triệu.
- Ca VF 7 giá 740 triệu: nhóm chủ xe giảm 5%, tương đương 37 triệu; nhóm đặc biệt giảm 7%, tương đương 51,8 triệu.
- Ca Limo Green giá 699 triệu: cả hai nhóm áp dụng bậc 9%, tương đương 62,91 triệu; giá xe sau ưu đãi 636,09 triệu.
- Dropdown chỉ cho chọn một ưu đãi khách hàng tại một thời điểm, nên Vì tương lai xanh 2 không thể được chọn đồng thời với voucher Tri ân khách hàng xe xăng VinFast chuyển đổi xanh.

## Bổ sung dữ liệu xe — 15/09/2026

- Rà soát 12 mẫu xe bằng trang sản phẩm, brochure và chính sách chính thức; thêm nguồn, ngày kiểm tra, ghi chú chênh lệch và phần tóm tắt đầu trang chi tiết.
- Kiểm tra trang chi tiết của 12 mẫu ở 1280, 390 và 320 px, cả sáng/tối: 72 cấu hình đều không tràn ngang, không lỗi ảnh và có đủ tóm tắt, nguồn cùng các nhóm thông số thu gọn.
- Bổ sung kiểm tra tự động cho cấu trúc dữ liệu, giá phiên bản, nguồn HTTPS, dữ liệu EC Van/VF 2/VF 7/MPV 7, bảo hành và chống chèn HTML.
- Giá xe và danh sách phiên bản không đổi. VF 2 được cập nhật đúng 3 màu cơ bản (Trắng, Đỏ, Bạc) và 5 màu nâng cao phụ phí 8 triệu đồng.
- Kiểm thử trực tiếp báo giá VF 2: màu cơ bản có phụ phí 0 đồng; Xanh Urban Mint cộng đúng 8 triệu đồng, đưa giá xe từ 188 triệu lên 196 triệu đồng trước chi phí lăn bánh.

## Công thức vay và bảo hiểm vật chất — 17/09/2026

- Chuyển lịch vay sang dư nợ giảm dần: gốc chia đều theo số kỳ, lãi từng tháng tính trên dư nợ đầu kỳ; lãi suất thả nổi bắt đầu đúng từ tháng sau thời gian ưu đãi.
- Ca kiểm tra 500 triệu, 60 tháng, ưu đãi 8,5% trong 12 tháng rồi 11,5%: kỳ đầu 11.875.000đ, dư nợ sau ưu đãi 400.000.000đ, kỳ 13 là 12.166.667đ và kỳ cuối về 0đ.
- VF 2, VF 3 và EC Van dùng bảo hiểm vật chất cố định 4.500.000đ cho cả biển trắng/vàng. Các xe khác dùng 1,2% cho biển trắng và 1,6% cho biển vàng, tính trên giá xe sau ưu đãi và phụ phí màu.
- Bảo hiểm vật chất được đặt trước dòng tổng và cộng vào “Tổng chi phí lăn bánh”: luôn cộng ở phương án vay, chỉ cộng ở phương án trả thẳng khi người dùng bật lựa chọn bảo hiểm.
- Bảo hiểm vật chất tính theo tỷ lệ được làm tròn lên bội số 1.000đ gần nhất; mức cố định 4.500.000đ không thay đổi.
- Khung thiết lập báo giá chuyển các trường chính sang một cột, tăng bề rộng hợp lý và đã kiểm tra trực quan ở giao diện tối; không còn chữ chồng hoặc thẻ bị ép ngang.

## Mở rộng tóm tắt xe — 19/09/2026

- Phần tóm tắt đầu trang chi tiết bổ sung dung lượng pin, kích thước dài × rộng × cao và dung tích khoang hành lý/khoang hàng.
- EC Van hiển thị đồng thời dung tích 2.600 lít và kích thước khoang hàng; các xe du lịch dùng dung tích khoang hành lý theo cấu hình đã công bố.
- VF 2 chưa có dung tích khoang hành lý được VinFast xác nhận nên hiển thị rõ “Chưa có số liệu hãng công bố”, không suy diễn từ mẫu xe khác.
- Đã kiểm tra trực quan VF 6 và VF 2; bố cục 4 thẻ hàng đầu, kích thước rộng hai cột và hai thẻ khoang chứa/sạc ở hàng sau hiển thị rõ ràng.

## Bổ sung VF Wild Comfort — 19/09/2026

- Thêm VF Wild Comfort vào trang chủ, bảng giá, so sánh, chi tiết xe, biểu mẫu tư vấn và công cụ báo giá.
- Giá niêm yết 860 triệu đồng; ưu đãi cọc tiên phong 61 triệu đồng đến 30/06/2027 giúp giá sau ưu đãi còn 799 triệu đồng. Chính sách miễn phí 20 lượt sạc/tháng được ghi rõ đến 10/02/2029.
- Bổ sung thông số REEV: pin 46,4 kWh, thuần điện trên 250 km, kết hợp trên 1.000 km (NEDC), công suất 160 kW, mô-men xoắn 280 Nm, sạc DC tối đa 90 kW và kích thước 5.376 × 2.069 × 1.873 mm.
- Tách nhóm “Hệ thống REEV” để hiển thị động cơ xăng 1,5 L, bình nhiên liệu 56 lít và tầm hoạt động kết hợp mà không tạo trường thiếu trên các mẫu xe thuần điện.
- Không hiển thị công cụ ước tính chi phí thuần điện trên VF Wild vì chưa có dữ liệu tiêu hao xăng của hệ thống REEV; các mục chưa được tài liệu công bố như dung tích thùng hàng được giữ ở trạng thái chờ xác nhận.
