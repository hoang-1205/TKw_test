# Trang 6 - Thông tin sinh viên (Giảng viên)

Người làm: Trần Thị Quỳnh Như

## Chức năng
- Danh sách sinh viên: tìm theo tên hoặc MSSV, lọc theo trạng thái
- Hồ sơ sinh viên: họ tên, MSSV, lớp, ngành, email, SĐT, nhóm, học phần
- Xem điểm: điểm trung bình, số mốc đã chấm, đã nộp, trễ hạn, bảng điểm và nhận xét
- Chi tiết đồ án: thông tin đồ án, thành viên nhóm, đếm ngược đến mốc báo cáo tiếp theo, timeline các mốc báo cáo

## Yêu cầu đề 2.1.4
- HTML5: timeline dùng thẻ lồng nhau (ol > li > article > header), thẻ time
- CSS3: đường nối timeline bằng ::before, ::after; badge Đã nộp / Chưa nộp / Trễ hạn
- JavaScript: kiểm tra định dạng URL của link đã nộp, đồng hồ đếm ngược đến ngày báo cáo

## Cách chạy
Mở file `trang6-thong-tin-sinh-vien/student-detail.html` bằng trình duyệt.

## Ghi chú khi ghép
- Màu chính: #00008B
- Dữ liệu lưu localStorage với key `pm_students`, `pm_milestones`
- Navbar link tới: index.html, timeline.html, grading.html, login.html
- Mở đúng sinh viên: `student-detail.html?id=SV01`
