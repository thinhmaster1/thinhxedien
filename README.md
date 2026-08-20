# Thịnh Xe Điện

Website tĩnh giới thiệu, tra cứu và lập báo giá các dòng ô tô điện VinFast tại Thủ Dầu Một, Bình Dương.

Website được xây dựng bằng HTML, CSS và JavaScript thuần. Dữ liệu xe và chương trình khuyến mãi được lưu riêng trong JSON, không cần hệ quản trị cơ sở dữ liệu hay bước build.

## Chức năng

- Danh sách xe theo nhóm: xe đô thị, SUV gia đình, SUV cao cấp, MPV/xe dịch vụ và xe thương mại.
- Trang chi tiết từng xe với phiên bản, màu sắc, thông số, tiện nghi, an toàn và ADAS.
- Công cụ so sánh tối đa ba dòng xe.
- Bảng giá tất cả dòng xe và phiên bản, hỗ trợ thu gọn và in một trang A4.
- Trang tổng hợp ưu đãi và quyền lợi VinClub.
- Công cụ báo giá theo xe, phiên bản, màu, khu vực đăng ký, loại biển và bảo hiểm.
- Công cụ tính khoản vay, tiền trả hàng tháng, tiền lãi và lịch dư nợ.
- Ước tính chi phí vận hành xe điện so với xe xăng hoặc dầu.
- Trang thông tin tư vấn VinFast tại Thủ Dầu Một, Bình Dương.
- Giao diện responsive và menu riêng cho thiết bị di động.
- SEO cơ bản gồm metadata, dữ liệu có cấu trúc, `robots.txt` và `sitemap.xml`.

## Các trang chính

| Tệp | Nội dung |
| --- | --- |
| `index.html` | Danh sách và phân loại các dòng xe |
| `detail.html?xe=vf-7` | Trang chi tiết theo slug xe |
| `compare.html?xe=vf-3,vf-7,vf-9` | So sánh các dòng xe |
| `data.html` | Bảng giá toàn bộ xe và phiên bản |
| `policies.html` | Khuyến mãi và quyền lợi VinClub |
| `quote.html` | Công cụ lập báo giá nội bộ |
| `loan.html` | Công cụ tính lãi và dư nợ trả góp |
| `vinfast-thu-dau-mot-binh-duong.html` | Thông tin tư vấn và showroom |

## Dữ liệu

- `data/cars.json`: giá, phiên bản, màu sắc, hình ảnh và thông số xe.
- `data/promotions.json`: ưu đãi theo dòng xe, khách hàng và VinClub.

Các chương trình VinClub trong báo giá được tách khỏi ưu đãi khách hàng. Ưu đãi Công an & Quân đội hoặc VNPost không được áp dụng đồng thời với VinClub.

Khi cập nhật JSON:

- Giữ nguyên slug của xe vì các URL chi tiết và so sánh phụ thuộc vào slug.
- Giá sử dụng đơn vị VND và lưu dưới dạng số nguyên.
- Phụ kiện AFS phải được ghi rõ là tùy chọn, không trình bày như trang bị tiêu chuẩn.
- Trường chưa có thông tin nên để trống để giao diện hiển thị “Dữ liệu đang cập nhật”.

## Cấu trúc mã nguồn

```text
css/
  base.css
  components.css
  pages.css
  refinements.css
data/
  cars.json
  promotions.json
js/
  access.js
  components.js
  core.js
  pages/
    compare.js
    data.js
    detail.js
    index.js
    loan.js
    local.js
    policies.js
    quote.js
public/
  cars/
```

## Chạy demo trên máy

Website sử dụng `fetch()` để đọc JSON nên cần chạy qua một máy chủ tĩnh:

```bash
python3 -m http.server 3000 --bind 127.0.0.1
```

Sau đó mở:

```text
http://127.0.0.1:3000/index.html
```

## Công cụ nội bộ

Trang báo giá và trả góp được ẩn mặc định. Nhập passcode tại khu vực “Công cụ nội bộ” ở cuối trang để mở hai chức năng trong phiên trình duyệt hiện tại.

Đây chỉ là lớp kiểm soát truy cập phía trình duyệt, không thay thế cơ chế xác thực phía máy chủ nếu website cần bảo vệ dữ liệu nhạy cảm.

## Lưu ý

- Giá và ưu đãi có thể thay đổi theo chính sách VinFast tại từng thời điểm.
- Số liệu NEDC, WLTP và CLTC sử dụng chu trình đo khác nhau, không nên so sánh trực tiếp.
- Website do tư vấn viên showroom vận hành, không phải website chính thức của VinFast.
