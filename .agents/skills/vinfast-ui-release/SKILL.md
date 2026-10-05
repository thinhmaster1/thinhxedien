---
name: vinfast-ui-release
description: Kiểm tra giao diện hoặc phát hành thay đổi của repo Thịnh Xe Điện khi người dùng yêu cầu kiểm thử UI, commit hoặc push.
---

Đọc docs/ARCHITECTURE.md, docs/TESTING.md và docs/RELEASE.md ở root repo.

Kiểm tra trang bị ảnh hưởng qua máy chủ tĩnh, ở desktop và điện thoại nhỏ, sáng/tối. Xem CSS premium.css có ghi đè refinements.css; kiểm tra số tiền, các bảng, radio, menu và thông báo nhập liệu. Không gửi biểu mẫu tư vấn ra ngoài khi chỉ kiểm thử.

Tăng phiên bản cache của tài nguyên sửa. Ghi QA đúng bằng chứng; không coi screenshot desktop là xác nhận mobile.

Commit/push chỉ khi được người dùng yêu cầu hoặc đã cấp quyền. Stage đúng phạm vi; kiểm tra branch/remote; không force-push; báo hash và kết quả. Xác minh website live khi được yêu cầu phát hành/kiểm tra deployment, không suy ra từ push.
