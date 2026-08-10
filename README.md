# VinFast Explorer

Website tĩnh tổng hợp thông số, giá bán và so sánh các dòng xe điện VinFast.

## Cấu trúc

- `index.html`: trang tổng quan xe
- `detail.html`: trang chi tiết xe
- `compare.html`: trang so sánh tối đa 3 xe
- `styles.css`: toàn bộ giao diện responsive
- `app.js`: tải dữ liệu, lọc, tìm kiếm và so sánh
- `data/cars.json`: dữ liệu xe

## Chạy trên máy

Website dùng `fetch()` để đọc JSON nên cần chạy qua một máy chủ tĩnh, ví dụ:

```bash
python3 -m http.server 3000
```

Sau đó mở `http://localhost:3000`.
