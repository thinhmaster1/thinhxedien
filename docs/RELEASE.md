# Phát hành

Repo hiện dùng origin GitHub và nhánh main. Kiểm tra branch/remote thực tế mỗi lần phát hành.

1. Đọc git status/diff; giữ thay đổi không thuộc nhiệm vụ và chỉ stage tệp đúng phạm vi.
2. Chạy kiểm tra theo docs/TESTING.md; xác nhận giá/chính sách và phiên bản cache nếu có sửa JS/CSS.
3. Cập nhật tài liệu hiện hành; lịch sử QA chỉ ghi kết quả có bằng chứng.
4. Khi người dùng yêu cầu hoặc đã cấp quyền, commit mô tả thay đổi và push branch xác nhận. Nếu remote từ chối, kiểm tra nguyên nhân; không force-push để vượt lịch sử.
5. Báo commit, branch và tình trạng còn thay đổi. Push thành công chỉ xác nhận GitHub nhận commit; muốn xác nhận website phát hành phải kiểm tra deployment/live riêng.

URL website dùng trong SEO: https://thinhmaster1.github.io/thinhxedien/.
