---
name: vinfast-quote-check
description: Kiểm tra hoặc sửa nghiệp vụ báo giá và lãi vay trong repo Thịnh Xe Điện, gồm ưu đãi, bảo hiểm, phí và ảnh PNG.
---

Đọc docs/QUOTE_RULES.md và docs/TESTING.md ở root repo. Kiểm tra hàm thuần trong js/quote-calculator.js, js/loan-calculator.js và biểu mẫu js/pages/quote.js.

Theo dõi toàn bộ chuỗi giá phiên bản + màu -> ưu đãi -> giảm thêm -> bảo hiểm -> lăn bánh -> trả trước/dư nợ. Giữ tiền vay tách khỏi lăn bánh; phí dịch vụ là 0/3/5 triệu, mặc định 3 triệu. Thử thay đổi đầu vào để phát hiện giá trị cũ còn sót.

Khi sửa phép tính, kiểm tra ca có kết quả độc lập trong TESTING.md và ca biên phù hợp. Nếu chỉ được yêu cầu review, đưa lỗi có bằng chứng trước khi sửa. PNG phải thống nhất với biểu mẫu và phương thức đang chọn. Nêu rõ phạm vi kiểm tra thực tế.
