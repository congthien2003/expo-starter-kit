# Mobile base stability — checklist nghiệm thu

Trạng thái cập nhật 2026-11-01: người dùng đã cho phép agent chạy verification. Typecheck, lint, 19 suites/48 tests, Expo checks và Android/iOS Hermes export đã PASS; audit còn findings, native/device scenarios vẫn Not run. Xem [báo cáo kết quả thực tế](2026-11-01-verification-results.md).

Review độc lập đã chỉ ra lỗi restore khi cleanup thất bại, timestamp notification, assertion JSON và layout/accessibility của Button. Các test hồi quy đã chạy cùng suite; kết quả này chưa chứng minh rendering hoặc native behavior trên thiết bị.

## Môi trường

| Môi trường | Trạng thái | Kết quả/thiết bị/build |
|---|---|---|
| TypeScript | Passed | npm run typecheck, exit 0 |
| ESLint | Passed | npm run lint, exit 0, zero warnings |
| Jest tập trung | Passed | 19 suites, 48 tests |
| Expo dependency compatibility/doctor | Passed | up to date; doctor 21/21 |
| Android/iOS Hermes export | Passed | production HBC ở .expo/verify-export/ |
| npm audit | Findings remain | 0 critical, 12 high, 45 moderate, 7 low |
| Android emulator | Not run | |
| Android thật + development build | Not run | |
| iOS simulator (macOS) | Not run | |
| iPhone thật + development build | Not run | |
| Tablet và large font | Not run | |

Dependency test được cài với lifecycle scripts tự động tắt; verification sau đó được chạy theo yêu cầu trực tiếp. Có Hermes bundles mới, chưa có APK/AAB/IPA, EAS project hoặc app ID/credentials được tạo. iOS simulator cần Mac; không chạy được trực tiếp trên Windows.

## Command tự chạy

```powershell
npm run typecheck
npm run lint
npm run test:unit
npx expo install --check
npx expo-doctor@latest
npm audit
npx expo start --clear
```

Kỳ vọng typecheck/lint/test exit 0; dependency checks không còn mismatch cần xử lý. Audit phải đọc từng finding, không force upgrade. Dev server mở không chứng minh native push; phần đó cần development build với credentials thật. Không có CI tự chạy các command này.

## Auth/session và điều hướng — chạy trên Android và iOS

- [ ] Fresh install mở login sau loading, không nháy nội dung private.
- [ ] Login email sai/empty password bị validation; valid input success về home, user email đúng đã nhập.
- [ ] Double tap submit chỉ tạo một operation; network-error giữ field để retry; invalid-credentials có thông báo.
- [ ] Register password 7 ký tự hoặc confirm lệch bị chặn; 8 ký tự/khớp thành công, không auto-login, email điền sẵn ở login.
- [ ] Forgot không gửi email; ticket demo được cấp trong process; reset thành công và có mô tả không đổi password thật.
- [ ] Ticket hết hạn đúng 10 phút/dùng lại/ticket thay thế/ticket từ deep link tùy ý/restart app không reset được.
- [ ] Restore session hợp lệ sau restart; session hết hạn khi mở lại/foreground không truy cập màn private.
- [ ] Legacy keys hoặc envelope hỏng/unknown version không được tin là phiên hợp lệ; dữ liệu hỏng có retry/clear.
- [ ] SecureStore read/write/delete failure có thông báo; failed write không báo login thành công; retry cleanup không tự login.
- [ ] Logout trong khi restore/login/getMe đang chờ không hồi sinh user; login A chậm không ghi đè login B.
- [ ] Private deep link signed out về login, login về home; authenticated không vào auth routes.
- [ ] Logout từ account/demo/modal rồi Android Back/iOS swipe không quay lại nội dung private.
- [ ] Nhiều 401 cùng phiên chỉ invalidate một lần; 401 public/stale không ảnh hưởng phiên mới; timeout/network/403 không logout.
- [ ] Public HTTP request không có bearer; API URL origin khác bị chặn; thiếu env không gửi tới endpoint giả.

Một số lỗi native/storage/race cần test mocks, debugger hoặc development instrumentation; không có nút production để cố ý phá storage. Khi delete native thất bại hoàn toàn, dữ liệu có thể còn trên thiết bị sau restart; UI phải nói rõ giới hạn này.

## UI

- [ ] Input onFocus/onBlur của caller và state nội bộ cùng hoạt động; ref.focus, RHF touched và password toggle đúng.
- [ ] className/inputClassName đúng nơi, SafeArea edges/màu HEX/style custom có hiệu lực.
- [ ] Keyboard mở: chạm submit một lần hoạt động; trường cuối/nút vẫn cuộn tới được.
- [ ] Tab screens không có bottom padding trùng; status bar/notch/landscape không che nội dung.
- [ ] Typography font scale hệ thống 100%, 150%, 200%; phone/tablet vẫn đọc và thao tác được, không cắt nút quan trọng.
- [ ] Modal dài cuộn, keyboard tránh nội dung, nút đóng có nhãn và Android Back đóng đúng.
- [ ] VoiceOver/TalkBack đọc label/state của input, icon controls, loading/disabled; haptics failure không thành unhandled rejection.
- [ ] Render error mở fallback; retry remount, không tự gửi lại operation đã chạy.

## Notifications/socket

- [ ] Startup không hỏi permission, không request push token, không connect socket.
- [ ] Request permission qua action; deny không bị hỏi lặp; Settings→foreground cập nhật status.
- [ ] Missing projectId/thiết bị không phù hợp/network failure giữ trạng thái quyền, không tạo token giả, có lỗi/retry.
- [ ] Token hoàn tất sau logout không quay lại state mới; token không log/hiển thị nguyên vẹn.
- [ ] Nhận foreground notification, tap lúc đang mở và cold start route home/account sau router ready.
- [ ] Signed out nhận tap: login trước, chỉ thực hiện pending hợp lệ sau login; logout xóa pending.
- [ ] Response trùng không navigate lại trong process; response trước logout không được phát lại từ last response.
- [ ] Payload URL/path hoặc screen lạ bị bỏ qua. Không hứa exactly-once khi native clear last response thất bại xuyên process.
- [ ] App mặc định không import socket hoặc subscribe auth cho socket; cấu hình socket thiếu/sai không chặn bootstrap.
- [ ] Feature opt-in tạo socket service riêng: public không có bearer; authenticated lấy token từ callback, callback null bị chặn; connect đồng thời dùng một attempt, disconnect hủy attempt cũ.
- [ ] Feature có realtime tự disconnect khi logout/token thay đổi/unmount; reconnect có token mới sau khi disconnect, không có cơ chế tự động trong core.
- [ ] Không tuyên bố đã đăng ký/hủy token với backend vì chưa có backend integration.

## Ghi nhận kết quả

Mỗi lần người dùng chạy: thêm ngày, OS/model, SDK/build, command/scenario, exit code/kết quả, log đã che secret và lỗi còn lại. Không thay Not run bằng Passed chỉ từ đọc source hoặc vì package install thành công.
