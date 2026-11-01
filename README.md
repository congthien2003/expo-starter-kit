# Expo Starter Kit — Android & iOS

Source base TypeScript/Expo với NativeWind, UI dùng chung, auth mock, quản lý phiên và notifications chủ động. Đợt cập nhật này tập trung Android/iOS; web không nằm trong phạm vi nghiệm thu. Chưa coi đây là bằng chứng production readiness: xem [checklist mobile](docs/verification/mobile-base-stability.md) và kết quả kiểm tra thực tế của dự án bạn.

## Bắt đầu

```powershell
npm ci
Copy-Item .env.example .env.local
npm start
```

Các command trong README do developer tự chạy. Expo Go dùng để xem UI phù hợp; push cần development build, cấu hình native, EAS project và thiết bị thật. iOS simulator cần macOS/Xcode; Windows không chạy iOS simulator local.

Dependency installation trong đợt triển khai dùng `--ignore-scripts`; lifecycle scripts chưa được chạy. Nếu môi trường npm chặn script của package, review package/script cụ thể theo chính sách npm của bạn, không tắt chính sách hoặc dùng force install để bỏ qua lỗi.

## Cấu hình

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| EXPO_PUBLIC_APP_ENV | development | development / staging / production |
| EXPO_PUBLIC_AUTH_MODE | mock | Đợt này chỉ hỗ trợ mock; giá trị khác báo lỗi |
| EXPO_PUBLIC_API_URL | Trống | URL API HTTP(S), chỉ cần khi gọi API helper |

Không hardcode endpoint theo `__DEV__`. Đặt URL đúng môi trường trong `.env.local`/build environment; chọn staging không tự tạo endpoint. Thiết bị thật phải truy cập được IP LAN hoặc hostname của máy chủ, không dùng localhost để trỏ về máy development. Biến `EXPO_PUBLIC_*` nằm trong bundle, không dùng cho secret.

Mock không gọi backend. API URL trống vẫn cho phép app khởi động; gọi API khi chưa cấu hình trả lỗi có hướng dẫn. Socket là helper tùy chọn, không thuộc config bootstrap; lỗi/missing socket URL không ảnh hưởng app không dùng realtime. Lỗi core env lúc khởi động có fallback và retry sau khi sửa cấu hình/reload.

## Auth demo

- Login nhận email hợp lệ và password không rỗng; không xác minh password với máy chủ.
- Register nhận tên, email, password tối thiểu 8 ký tự và xác nhận trùng; thành công quay về login, không tự đăng nhập.
- Forgot không gửi email/SMS. Sau thông báo trung tính, dùng nút tiếp tục reset demo.
- Reset dùng ticket trong bộ nhớ, hết hạn sau 10 phút, dùng một lần, ticket mới thay ticket cũ và restart app làm mất ticket. Query email không xác định tài khoản reset; chỉ ticket service quyết định.
- Register/reset không lưu tài khoản hoặc password và không thay đổi điều kiện login demo. Không dùng mock như một cơ chế bảo mật.
- Development có picker success / invalid-credentials / network-error / session-expired. Reset scenario để trở về success; bản production không có picker, mock vẫn được ghi rõ.

Session lưu một envelope v1 trong SecureStore (`auth_session_v1`), có user/token và expiresAt (mặc định một giờ). Kiểm tra hạn khi restore, request có auth và foreground. Session cũ từ access_token/refresh_token/stored_user bị xóa và yêu cầu login lại một lần.

Lỗi storage không bị bỏ qua. Login chỉ thành công khi lưu được phiên. Logout/401/hết hạn xóa user trong bộ nhớ và hủy kết quả auth cũ. Feature có dùng socket tự disconnect khi phiên thay đổi hoặc kết thúc. Khi native storage không xóa được, app báo retry; dữ liệu có thể vẫn còn trên thiết bị và được đọc lại sau restart nếu không retry thành công.

## Routes và cấu trúc

| URL | Truy cập |
|---|---|
| / | Entry chuyển tới login hoặc home sau bootstrap |
| /login, /register, /forgot-password, /reset-password | Chưa đăng nhập |
| /home, /account | Đã đăng nhập |
| /demo, /demo/components, /demo/explore, /demo/finance-home, /demo/integrations | Đã đăng nhập |
| /modal | Đã đăng nhập, presentation modal |

Deep link private lúc signed out đưa về login; login bình thường về home, không ghi nhớ destination. Notification allowlist có pending destination riêng. Logout loại bỏ private routes khỏi lịch sử điều hướng.

```text
app/                    Route/layout mỏng
features/auth/          Forms, schemas, mock services, provider, session lifecycle
features/demo/          Home/account, gallery và integrations demo
components/ui/         Components dùng chung
context/               Notification provider
hooks/                 Hooks dùng chung
lib/                   API, errors, socket, notification navigation
models/common/         ApiResponse và pagination
constants/             Environment configuration
docs/verification/     Checklist và trạng thái bằng chứng
```

Chỉ tạo folder khi có implementation. Code riêng feature colocate tại feature. Để bắt đầu app mới, thay demo feature/route bằng nghiệp vụ của bạn, giữ auth/shared components cần dùng; script reset cũ đã được bỏ vì có thể xóa nhầm các nền tảng dùng chung.

## API và phiên

```typescript
import api from '@/lib/api';
import type { ApiResponse } from '@/models/common';

// Mặc định yêu cầu phiên hiện tại. Đây là ví dụ cho backend của app bạn.
const result = await api.get<ApiResponse<MyData>>('/my-resource', { signal });
// Public request không gắn bearer. authMode tránh trùng option Basic auth của Axios.
const publicResult = await api.get<ApiResponse<MyData>>('/public-resource', { authMode: 'none' });
```

Helper chỉ cho phép origin API đã cấu hình, timeout 15 giây, hỗ trợ AbortSignal và reject AppError với kind rõ ràng. Không tự retry POST. 401 của public request hoặc phiên cũ không xóa phiên mới; network/timeout/403 không logout. Không có refresh-token endpoint cho tới khi app cung cấp contract backend thật.

`useAuth()` expose user, isAuthenticated, isBootstrapping, sessionError, cleanupError, login, logout, refreshUser, retryRestore, retryCleanup. `login()` trả ApiResponse<User>, không còn boolean; form dùng RHF isSubmitting. Chỉ session manager ghi/xóa phiên; tokenService còn getters/clear compatibility, không còn setters token/user riêng lẻ. ApiResponse canonical ở models/common, success bắt buộc data; lib/types chỉ re-export.

## UI dùng chung

- `Input`: className cho outer container, inputClassName cho TextInput; hỗ trợ ref và compose onFocus/onBlur với state nội bộ.
- `ScreenWrapper`: mặc định scroll keyboardShouldPersistTaps=handled, có keyboardVerticalOffset và cờ insets. Màn tabs không cộng lại bottom inset do tab bar đã sở hữu phần đó.
- `SafeArea`: edges và màu nền bất kỳ qua style; caller style được merge sau mặc định.
- `Typography`: scale theo chiều rộng, giới hạn 0.9–1.15 để tablet không phóng chữ quá lớn; vẫn giữ font scaling hệ thống; explicit style có thể override fontSize.
- `Modal`: cuộn nội dung dài, keyboard avoidance, bottom inset, Android Back và nhãn nút đóng.
- `ErrorState` dùng cho async errors có retry; AppErrorBoundary bắt render error. Retry render không đảm bảo side effect trước đó được hoàn tất hoặc hoàn tác.

UI đang light-only. Đổi native config/theme có thể cần rebuild development client. Không có global isLoading/isOnline giả cho mọi request; mỗi feature sở hữu trạng thái thao tác của mình.

## Notifications

Startup chỉ đọc quyền và đăng ký listeners, không xin quyền hoặc token. Vào `/demo/integrations` để chủ động xin quyền/đăng ký; denied có hướng dẫn Settings. Token được ẩn trên UI, không log hoặc gửi backend.

Merge EAS project ID của bạn vào expo config:

```json
{ "expo": { "extra": { "eas": { "projectId": "YOUR_EAS_PROJECT_ID" } } } }
```

Đây chỉ là đoạn cấu hình cần merge, không thay toàn bộ app.json. Chưa cấu hình bundle identifier/package, native credentials hoặc EAS project cho một app phát hành cụ thể. Thiếu config/thiết bị/network có thông báo và retry, không tạo token giả.

Notification data chỉ nhận `{ "screen": "home" }` hoặc `{ "screen": "account" }`; URL/path tùy ý bị bỏ qua. Tap foreground/cold start đợi router và session sẵn sàng; signed out giữ một pending destination cho sau login. Logout bỏ pending và token local. Timestamp native được chuẩn hóa giây/mili giây; notification có thời điểm nhận trước lần logout bị bỏ qua kể cả callback/tap tới sau đó. Dedup sống trong process; response cũ được clear best-effort, không hứa exactly-once xuyên process khi native clear thất bại. Backend token registration/unregistration chưa được triển khai.

## Socket tùy chọn

App mặc định không import socket, không tạo client và không subscribe phiên cho socket. Chỉ feature cần realtime mới import `createSocketService` từ `@/lib/socket`. Helper không biết AuthProvider/authMode và hỗ trợ cả public connection lẫn token do feature cung cấp.

```typescript
import { createSocketService } from '@/lib/socket';

// Đặt tại feature sở hữu realtime, không đưa vào root layout mặc định.
const realtime = createSocketService({
  url: 'https://YOUR_SOCKET_SERVER',
  getAccessToken: async () => /* lấy token hợp lệ từ auth của feature */ null,
});

// Chỉ gọi theo lifecycle thực tế của feature; catch AppError để hiển thị lỗi.
const socket = await realtime.connect();
socket.on('feature-event', handler);
// Khi logout, đổi tài khoản/token hoặc feature unmount:
realtime.disconnect();
```

Ví dụ trên là khung tích hợp: thay URL, callback và handler của feature; callback null cố ý từ chối kết nối, không gửi token mock ra server. Public socket bỏ `getAccessToken`. Có thể bỏ option url và tự thêm `EXPO_PUBLIC_SOCKET_URL` vào `.env.local`; biến này chỉ được đọc/validate khi connect, không nằm trong env mẫu bắt buộc.

Mỗi factory tạo service riêng, chia sẻ pending connect bên trong service đó. `connect()` resolve khi client đã được tạo/khởi động, không đảm bảo handshake thành công; lắng nghe `connect`/`connect_error` từ client để theo dõi kết nối. Reconnect dùng instance/token hiện tại; khi token đổi phải disconnect rồi connect lại để đọc token mới. Feature tự subscribe trạng thái auth khi cần và bỏ subscription khi unmount. Helper không tự bật theo mock/real auth.

Dependency `socket.io-client` vẫn đi kèm helper mẫu. App không dùng realtime không cần wiring/config socket; nếu muốn bỏ cả dependency, xóa `lib/socket.ts`/`lib/socket.test.ts` rồi tự chạy `npm uninstall socket.io-client`. Không có native setup socket bắt buộc cho app mặc định.

## Kiểm tra do developer chạy

```powershell
npm run typecheck
npm run lint
npm run test:unit
npx expo install --check
npx expo-doctor@latest
npm audit
npx expo start --clear
```

Test dùng jest-expo 57/Jest 29 và RNTL 13 phù hợp Router SDK 57; react-test-renderer pin cùng phiên bản React. Không nâng riêng công cụ test sang hướng dẫn SDK 58 mà chưa nâng toàn bộ SDK. Không dùng audit fix --force.

Ngày 2026-11-01, người dùng đã cho phép chạy verification: typecheck/lint, 19 suites/48 tests, Expo checks và Hermes export Android/iOS đã pass. Audit còn 64 findings (0 critical, 12 high); chưa có APK/AAB/IPA hay kiểm thử thiết bị. Xem [kết quả thực tế](docs/verification/2026-11-01-verification-results.md) và [checklist chi tiết](docs/verification/mobile-base-stability.md). Repo không có CI tự chạy verify theo quy tắc hiện tại.

## Thay đổi và quy tắc

Xem [CHANGELOG.md](CHANGELOG.md) và [AGENTS.md](AGENTS.md). Mỗi đợt thêm tính năng, sửa lỗi hoặc thay đổi hành vi/config/public interface phải cập nhật Unreleased trong cùng đợt. Không tự commit, bump version hoặc tạo release.
