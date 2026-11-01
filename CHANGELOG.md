# Changelog

Ghi nhận thay đổi thực tế của source base. Những mục chưa phát hành nằm trong `[Unreleased]`.

## [Unreleased]

### Added

- Thêm changelog và quy tắc cập nhật trong AGENTS.md cho các lần thay đổi tính năng, hành vi và cấu hình.
- Thêm session envelope v1, bộ kiểm tra tập trung và cấu hình môi trường mobile qua .env.example.
- Thêm form đăng ký, yêu cầu/đặt lại mật khẩu mock và các scenario lỗi cho development; không lưu password hay tạo tài khoản thật.
- Thêm route guard, home/account và khu demo riêng; notification tap hỗ trợ allowlist home/account và chờ đăng nhập.
- Thêm màn integrations để chủ động xin quyền, đăng ký push hoặc mở Settings.

### Changed

- ApiResponse có một nguồn tại models/common; auth context trả kết quả có thông báo lỗi và tách bootstrap khỏi trạng thái submit.
- Session cũ không có version/thời hạn yêu cầu đăng nhập lại; các setter token/user riêng lẻ được thay bằng quản lý phiên thống nhất.
- App dùng giao diện sáng; Typography giới hạn scale trên tablet nhưng vẫn tôn trọng font scaling của hệ thống.
- Login nằm tại /login, các form khác tại /register, /forgot-password, /reset-password; tabs tại /home và /account; demo tại /demo/*.
- Notifications không hỏi quyền lúc startup; socket trở thành helper opt-in, app mặc định không import hoặc khởi tạo client.
- Socket tách khỏi core config/auth/session; feature tạo service riêng, truyền URL/token khi cần và tự sở hữu lifecycle. Socket URL chỉ được validate khi connect.

### Fixed

- Lỗi lưu/xóa phiên không còn bị nuốt; thao tác async cũ không được khôi phục phiên sau logout.
- API chuẩn hóa lỗi, bỏ bearer khỏi public requests và không để 401 của phiên cũ xóa phiên mới.
- Sửa callbacks/style/ref của Input, edges/background/style của SafeArea, keyboard scrolling, modal dài và accessibility controls.
- Mỗi socket service giữ một connection attempt, hủy attempt/listeners khi feature gọi disconnect; không dùng chung instance giữa các feature nếu tạo qua factory.
- Chặn restore lại credential chưa xóa được trong cùng process; bootstrap đã xong không tự đọc lại storage khi provider remount.
- Chuẩn hóa timestamp notification iOS/Android, bỏ response cũ sau logout cả khi callback giao muộn; nút dài có thể co/wrap và giữ accessibility busy/disabled.
- Bổ sung Jest types và mock Worklets/font cho bộ test SDK 57; sửa fixture notification theo kiểu SDK thực tế.
- Chuyển animation Button sang SharedValue get/set để tương thích React Compiler; bootstrap không setState đồng bộ trong effect.
- Lint bao phủ cả features, services, hooks và test setup với zero warnings; test script chạy tuần tự mặc định để không cần truyền flag qua npm.
- Cập nhật shell-quote gián tiếp từ 1.8.3 lên 1.12.0 trong constraint hiện có để loại mục critical khỏi audit; dependency audit vẫn còn findings khác, xem báo cáo verification.

### Removed

- Bỏ script reset-project cũ không hiểu feature structure, các route demo trong tabs và appStore loading/error/online chưa có consumer.
