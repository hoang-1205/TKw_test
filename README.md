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
