<<<<<<< HEAD
<<<<<<< HEAD
# Project Milestone — Trang chấm điểm & nhận xét giảng viên

Giao diện minh họa cho học phần **Thiết kế & Lập trình Web**, giúp giảng viên xem bài nộp theo từng mốc, chấm điểm bằng rubric và gửi nhận xét cho nhóm sinh viên. Trang được xây dựng bằng **HTML5, CSS3 và JavaScript thuần**, không cần cài đặt thư viện hay chạy máy chủ.

## Bắt đầu

1. Đặt `index.html`, `style.css` và `script.js` trong cùng một thư mục.
2. Mở `index.html` bằng trình duyệt hiện đại (Edge, Chrome hoặc Firefox).
3. Chọn nhóm ở thanh bên, chọn **Tuần 1–3**, rồi xem bài nộp và chấm điểm ở hai cột chính.

> Tên file mở trang là `index.html`. Các liên kết bài nộp là dữ liệu minh họa; trang đích có thể chặn hiển thị trong iframe. Khi đó, dùng nút **Mở tab mới**.

## Chức năng

- **Hàng đợi chấm bài:** 8 nhóm mẫu, mỗi nhóm có 3 mốc báo cáo; tìm theo mã nhóm, đề tài hoặc tên sinh viên; lọc theo trạng thái; chuyển nhóm bằng nút hoặc `Alt + ←` / `Alt + →`.
- **Xem bài nộp:** thông tin thành viên, thời gian nộp, liên kết GitHub/demo, lịch sử phiên bản, khung xem trước và timeline deadline. Có thể đổi kích thước hai cột bằng chuột hoặc phím mũi tên khi thanh chia cột được chọn.
- **Chấm điểm:** rubric HTML5 (3 điểm), CSS3 Timeline & Badge (3 điểm), JS Form & Countdown (4 điểm). Điểm nhập theo bước 0,25; điểm gốc, mức phạt trễ và điểm cuối được tính ngay. Xếp loại từ A đến F.
- **Nhận xét:** soạn thảo có định dạng cơ bản, chèn câu góp ý nhanh, lập danh sách việc cần sửa, đính kèm ảnh/PDF tối đa 5 MB mỗi tệp và ghi chú riêng chỉ dành cho giảng viên.
- **Duyệt và lưu:** chọn Đạt, Yêu cầu nộp lại hoặc Không đạt; lưu nháp hoặc xác nhận gửi điểm. Trang nhắc xử lý thay đổi chưa lưu khi chuyển nhóm, tuần, phiên bản hoặc đóng tab.
- **Mô phỏng nộp bài:** nhập URL HTTP/HTTPS hợp lệ để tạo phiên bản mới. Đồng hồ đếm ngược theo deadline và đổi trạng thái khi quá hạn.

Giao diện dùng tiếng Việt, hỗ trợ bàn phím, có các nhãn ARIA cho thành phần tương tác và tự sắp xếp lại trên tablet/điện thoại.

## Cấu trúc dự án

| File | Vai trò |
| --- | --- |
| `index.html` | Khung trang, topbar, hàng đợi, hai vùng làm việc và vùng hiển thị modal/toast. |
| `style.css` | Hệ màu, bố cục responsive, trạng thái tương tác và timeline bằng `::before`/`::after`. |
| `script.js` | Dữ liệu mẫu, điều hướng, dựng giao diện, kiểm tra URL, countdown, tính điểm và lưu trạng thái trong phiên. |

## Lưu ý về dữ liệu

Đây là bản trình diễn giao diện **không có máy chủ hay cơ sở dữ liệu**. Điểm, nhận xét, tệp đính kèm và phiên bản mới chỉ được giữ trong bộ nhớ của tab hiện tại; tải lại trang sẽ khôi phục dữ liệu mẫu. Nút **Lưu & Gửi điểm** mô phỏng việc công bố điểm trong giao diện, không gửi dữ liệu đến sinh viên thật.
=======
# Trang 3: Nộp đồ án & Xem chi tiết đồ án (Sinh viên)

- **Người thực hiện:** Đinh Trung Hiếu
- **Thư mục code:** `hieu_trang3/`
- **Chức năng chính:**
  - Form nộp link đồ án kèm kiểm tra định dạng URL và đồng hồ đếm ngược (Countdown).
  - Xem chi tiết đồ án mới nộp, badge trạng thái và danh sách kiểm tra sai sót.
  - Chỉnh sửa, cập nhật lại bản nộp và xóa bản cũ trong lịch sử nộp bài (lưu bằng `localStorage`).
>>>>>>> origin/Hieu
=======
# Project Milestone

Hai trang dành cho sinh viên theo dõi tiến độ đồ án, nộp liên kết và xem phản hồi theo từng cột mốc. Giao diện sử dụng HTML5, CSS và JavaScript thuần, với màu chủ đạo `#00008B`.

## Các trang

| Đường dẫn | Chức năng |
| --- | --- |
| `timeline/index.html` | Xem hạn nộp, tìm và lọc cột mốc, nộp liên kết mới và xem lịch sử các lần nộp. |
| `diem-nhan-xet/index.html` | Xem điểm trung bình, biểu đồ điểm, trạng thái chấm và nhận xét theo từng mốc. |

## Chạy thử

Giải nén gói mã nguồn, mở thư mục chứa README trong VS Code và chạy `timeline/index.html` bằng Live Server. Chọn **Nộp bài** ở mốc **Thiết kế giao diện**, dán liên kết và xác nhận. Chuyển sang **Điểm & nhận xét**, chọn bộ lọc **Chờ chấm** để xem bài vừa nộp.

Lịch sử nộp bài được lưu bằng `localStorage` trên trình duyệt đang dùng. Điểm và lời nhận xét có sẵn là dữ liệu minh họa.

## Ghép vào website nhóm

Đặt hai thư mục `timeline/` và `diem-nhan-xet/` cạnh nhau. Nếu trang chủ của nhóm nằm cùng cấp với hai thư mục, thêm các liên kết sau vào thanh điều hướng:

```html
<a href="./timeline/index.html">Timeline dự án</a>
<a href="./diem-nhan-xet/index.html">Điểm &amp; nhận xét</a>
```

Khi đưa lên GitHub Pages, giữ cấu trúc thư mục này để hai trang tiếp tục liên kết với nhau.
>>>>>>> origin/Cuong
