# HỆ THỐNG QUẢN LÝ ĐỒ ÁN & TIẾN ĐỘ BÁO CÁO

![HTML5](https://img.shields.io/badge/HTML5-HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-CSS3-1572B6?logo=css3&logoColor=white)
![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=222222)
![Không backend](https://img.shields.io/badge/Backend-None-lightgrey)

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ](#công-nghệ)
- [Trạng thái các phân hệ](#trạng-thái-các-phân-hệ)
- [Phạm vi phụ trách](#phạm-vi-phụ-trách)
- [Dashboard](#dashboard)
- [Đăng nhập và đăng ký](#đăng-nhập-và-đăng-ký)
- [Quy tắc nghiệp vụ](#quy-tắc-nghiệp-vụ)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Chạy website](#chạy-website)
- [Giới hạn hiện tại](#giới-hạn-hiện-tại)
- [Định hướng phát triển](#định-hướng-phát-triển)

## Giới thiệu

Project Milestone hướng đến việc hỗ trợ sinh viên và giảng viên theo dõi tiến độ đồ án, các hạn báo cáo, quá trình nộp phiên bản, chấm điểm và trao đổi nhận xét. Website hiện là bản frontend dùng dữ liệu demo, tập trung vào Dashboard chung và giao diện đăng nhập/đăng ký.

## Công nghệ

| Công nghệ | Cách sử dụng |
|---|---|
| HTML5 | Cấu trúc trang và các phần tử ngữ nghĩa |
| CSS3 | Design system, bố cục Mobile First, hiệu ứng và responsive |
| Vanilla JavaScript ES6+ | Dữ liệu demo, tương tác giao diện, xác thực biểu mẫu và cập nhật thống kê |
| SVG | Đèn treo, biểu tượng và biểu đồ Dashboard |

Không sử dụng Node.js, npm, framework frontend, thư viện giao diện hoặc backend.

## Trạng thái các phân hệ

| # | Phân hệ | Trạng thái trong repository |
|---:|---|---|
| 1 | Dashboard tổng quan | Đã triển khai bằng dữ liệu demo |
| 2 | Timeline dự án đầy đủ | Chưa triển khai; Dashboard hiện có mini timeline các mốc chung |
| 3 | Nộp đồ án, chi tiết và lịch sử phiên bản | Chưa triển khai |
| 4 | Sinh viên xem điểm và nhận xét | Chưa triển khai |
| 5 | Giảng viên chấm điểm và nhận xét | Chưa triển khai |
| 6 | Danh sách, hồ sơ sinh viên và chi tiết đồ án | Chưa triển khai |
| 7 | Đăng nhập và đăng ký | Đã triển khai ở chế độ mô phỏng |

Các mục chưa triển khai được hiển thị dưới dạng trạng thái chờ tích hợp; chúng không phải các trang nghiệp vụ đã hoàn thành.

## Phạm vi phụ trách

- **Trang 1:** Dashboard chung cho sinh viên và giảng viên.
- **Trang 7:** Đăng nhập và đăng ký.

Các phân hệ còn lại được để dành cho thành viên phụ trách và giai đoạn tích hợp tiếp theo.

## Dashboard

Dashboard dùng chung cho cả hai vai trò và chỉ trình bày dữ liệu tổng quan toàn học phần:

- Tổng số sinh viên và đồ án, cùng số lượng đã nộp, chưa nộp và trễ hạn. Các số liệu được tính từ cùng một tập dữ liệu demo.
- Biểu đồ donut về trạng thái nộp và biểu đồ cột tiến độ theo mốc, dựng bằng SVG và JavaScript thuần.
- Mini timeline các mốc báo cáo chung, deadline gần nhất và countdown ngày/giờ/phút/giây.
- Khu vực thông báo chung và hướng dẫn thực hiện đồ án.
- Sidebar thay đổi theo vai trò demo và hamburger menu cho màn hình nhỏ.

Dashboard không hiển thị điểm, lịch sử nộp hay dữ liệu cá nhân của sinh viên. Chọn vai trò chỉ thay đổi nội dung điều hướng; đây không phải cơ chế phân quyền bảo mật.

## Đăng nhập và đăng ký

- Giao diện Mobile First với bóng đèn treo; có thể kéo dây bằng chuột/cảm ứng hoặc dùng bàn phím để bật/tắt ánh sáng.
- Đăng nhập kiểm tra trường bắt buộc và định dạng email; đăng ký kiểm tra họ tên, mã số sinh viên, email, mật khẩu tối thiểu 8 ký tự, xác nhận mật khẩu và điều khoản.
- Có nút hiện/ẩn mật khẩu và lựa chọn trải nghiệm giao diện theo vai trò sinh viên hoặc giảng viên.
- Đăng ký chỉ mô phỏng thao tác; không tạo tài khoản trên máy chủ. Mật khẩu không được lưu vào localStorage.
- Bố cục và biểu mẫu responsive cho mobile, tablet và desktop.

## Quy tắc nghiệp vụ

- Sinh viên và giảng viên sử dụng chung Dashboard tổng quan.
- Mỗi sinh viên chỉ liên kết với một đồ án.
- Một đồ án có thể có nhiều lần nộp; từng lần nộp được quản lý như một phiên bản.
- Một giảng viên có thể theo dõi và đánh giá nhiều sinh viên, nhiều đồ án.

Các quy tắc trên được thể hiện trong dữ liệu và giao diện demo; chúng chưa được bảo đảm bởi backend hay cơ sở dữ liệu.

## Cấu trúc thư mục

```text
.
├── Trang1_7/
│   ├── auth.html
│   ├── index.html
│   ├── css/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── dashboard.js
│       └── data.js
└── README.md
```

Thư mục `.github/skills/` được giữ lại trên máy phát triển và loại khỏi Git bằng cấu hình exclude cục bộ; nội dung skill không được đưa vào repository. Không có `.vscode/launch.json` trong cấu trúc dự án.

## Chạy website

1. Tải ZIP hoặc clone repository từ trang GitHub của dự án.
2. Mở thư mục `Trang1_7/`.
3. Mở `index.html` để xem Dashboard hoặc `auth.html` để xem trang đăng nhập/đăng ký bằng Google Chrome.
4. Không cần Node.js, npm, backend hoặc máy chủ tĩnh cho các chức năng hiện có.

Font Be Vietnam Pro được tải từ Google Fonts khi có kết nối Internet; nếu ngoại tuyến, trang sử dụng font dự phòng của hệ thống.

## Giới hạn hiện tại

- Đăng nhập và đăng ký chỉ là mô phỏng giao diện; chưa có xác thực thật, API hay cơ sở dữ liệu.
- Dữ liệu và thông báo trên Dashboard là dữ liệu mẫu.
- Các phân hệ 2–6 chưa được tích hợp trong repository này.
- Menu tới các chức năng chưa triển khai chỉ hiển thị thông báo chờ tích hợp.

## Định hướng phát triển

Hoàn thiện các phân hệ còn lại, tích hợp điều hướng và dữ liệu giữa các trang, sau đó kết nối dịch vụ xác thực và lưu trữ phù hợp để hình thành hệ thống quản lý đồ án hoàn chỉnh.
