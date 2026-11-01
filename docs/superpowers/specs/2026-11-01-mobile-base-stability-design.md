# Thiết kế củng cố Expo mobile starter kit

> Cập nhật đã được người dùng duyệt: socket là module tùy chọn, không gắn root/auth/core config. Phần socket bên dưới được thay thế bởi [kế hoạch socket tùy chọn](../plans/2026-11-01-optional-socket.md).

Ngày: 2026-11-01  
Trạng thái: Chờ người dùng duyệt thiết kế; chưa phải plan triển khai đã duyệt.

Builder check: reviewer độc lập đã đọc thiết kế và các dependency liên quan; kết luận `nothing important left`. Đây là review tài liệu, không phải bằng chứng test/runtime.

## 1. Mục tiêu và quyết định đã chốt

- Tạo source base dễ tái sử dụng cho Android và iOS.
- Giữ stack Expo, Expo Router, TypeScript, NativeWind, React Hook Form, Zod, Axios và Zustand hiện tại.
- Giữ auth mock, bổ sung luồng mẫu hoàn chỉnh trước khi kết nối backend thật.
- Củng cố theo từng giai đoạn, không tái cấu trúc toàn bộ một lượt.
- Giao diện sáng trong đợt này.
- Có CHANGELOG.md tại root và rule bắt buộc cập nhật trong AGENTS.md.
- Không triển khai hoặc kiểm thử web trong phạm vi đợt này; không cần xóa code web đang có.
- Không tự chạy build, test, lint hoặc lệnh verify. Cung cấp command/checklist để người dùng chạy.
- Không commit và không cài/nâng dependency chỉ để phục vụ lập thiết kế/plan.

## 2. Hiện trạng làm cơ sở

- features/auth đã có LoginScreen, loginSchema, AuthProvider, useAuth và authService mock.
- Login nằm trong tabs; chưa có route guard. Sign up và Forgot Password chỉ là text.
- AuthProvider dùng chung isLoading cho khởi tạo và thao tác; khôi phục user từ storage.
- utils/tokenService.ts nuốt lỗi đọc/ghi/xóa. Trạng thái trong bộ nhớ có thể lệch storage.
- lib/axios.ts xóa storage khi 401 nhưng không cập nhật AuthProvider.
- Có hai ApiResponse khác nhau ở lib/types và models/common.
- Config hardcode URL, staging chưa có cơ chế được chọn thực tế.
- Input không áp dụng className và có callbacks bị props ghi đè; SafeArea bỏ qua edges.
- socketService có thể tạo thêm instance trong lúc instance trước đang kết nối/reconnect.
- NotificationProvider đăng ký push khi mount; notification tap còn TODO.
- Màn demo có implementation dài trong app/, trái quy ước route mỏng.
- package.json có typecheck/lint; chưa có test suite và CI trong các file đã rà soát.

Đây là nhận định từ đọc code, không phải xác nhận runtime hoặc dependency compatibility.

## 3. Các hướng đã cân nhắc

### Hướng 1: Củng cố từng giai đoạn — người dùng đã chọn

Sửa các điểm lỗi rõ ràng, hoàn thiện luồng mẫu rồi chuẩn hóa các lớp dùng chung. Giữ phần đang hoạt động và chỉ di chuyển code khi phục vụ thay đổi cụ thể. Diff dễ review và có thể nghiệm thu từng giai đoạn.

### Hướng 2: Tái cấu trúc toàn bộ

Tổ chức lại providers, state, services và toàn bộ demo đồng thời. Đồng nhất cấu trúc sớm nhưng tăng phạm vi thay đổi và khó khoanh vùng regression. Không chọn trong đợt này.

## 4. Phạm vi và giới hạn

Trong phạm vi: sửa lỗi shared UI/storage/socket; auth mock hoàn chỉnh; điều hướng theo phiên; config; API errors; notifications chủ động; fallback lỗi; tài liệu và changelog; thiết kế bộ kiểm tra tập trung.

Ngoài phạm vi: backend/database, email/SMS thật, social login, biometrics, refresh token theo backend thật, realtime business features, offline sync, dark theme, OTA, analytics và publish store. Không thêm query framework, toast framework hoặc hệ thống event tổng quát khi chưa cần.

Tránh: mở rộng abstraction không có consumer, folder placeholder, tự cho rằng mock là bảo mật thật, báo kiểm tra pass khi chưa được chạy, và dùng lỗi mạng làm lý do tự động logout.

## 5. Thiết kế các phần

### 5.1. Phiên và lưu trữ

- AuthProvider là nơi sở hữu trạng thái phiên cho UI. Không tạo thêm auth state trong Zustand.
- Tách trạng thái khởi tạo phiên khỏi trạng thái thao tác form. Chặn render màn riêng tư trong lúc chưa khởi tạo xong.
- Lưu một session envelope có version, user, access token, refresh token tùy chọn và expiresAt trong SecureStore để giảm ghi dở dang nhiều key.
- Đọc session phải kiểm tra cấu trúc và thời hạn. Chỉ có token không đủ để coi là phiên hợp lệ.
- Session cũ từ các key hiện tại không có version/expiry sẽ bị xóa, yêu cầu đăng nhập lại một lần; README/changelog ghi rõ thay đổi này.
- Lỗi ghi phải được trả lên: chỉ chuyển sang authenticated sau khi lưu thành công. Không log password/token.
- Lỗi đọc hoặc dữ liệu hỏng: fail closed, không hiển thị màn riêng tư; thông báo lỗi và có thao tác thử lại/xóa phiên lỗi.
- Logout hoặc session invalidation phải xóa user trong bộ nhớ, vô hiệu các thao tác auth đang chạy và disconnect socket. Cố gắng xóa storage; nếu thất bại, hiển thị lỗi và cho retry, không báo đã xóa dữ liệu thành công.
- Nếu việc xóa thất bại hoàn toàn, dữ liệu có thể còn trên thiết bị và được đọc lại sau khi process khởi động lại; đây là giới hạn cần ghi rõ, không hứa logout bền vững khi storage không hoạt động.
- Dùng generation/request id để kết quả login/restore/getMe cũ không tái tạo phiên sau logout hoặc sau lần login mới.
- Mock session hết hạn sau một giờ; kiểm tra khi restore, trước authenticated request và khi app trở lại foreground. Hết hạn đưa về đăng nhập, không giả lập refresh vô thời hạn.
- Chỉ thêm thư mục features/auth/services hoặc utilities tương ứng khi có implementation thực tế; lớp lưu phiên thuộc auth, không để business logic auth ở shared utility không cần thiết.

### 5.2. Điều hướng và auth mock

- Root có route group (auth), (tabs), và route group demo riêng. Có index entry điều hướng theo trạng thái phiên.
- (auth): login, register, forgot-password, reset-password. Dùng Expo Router protected routes cho các nhóm phù hợp.
- (tabs) chứa home mẫu và trang account tối giản có user/logout; chỉ truy cập khi authenticated.
- Demo components/screens ở nhóm riêng, chỉ truy cập sau login; không hiện login như một tab.
- Modal hiện tại coi là demo và cũng yêu cầu login. Deep link vào route riêng tư khi signed out đưa về login; sau login về home, chưa hỗ trợ ghi nhớ destination.
- App mới mở: loading lúc restore, sau đó login hoặc home. Đăng nhập thành công không để Back quay lại login; logout không để Back mở lại nội dung riêng tư.
- Register: full name, email, password, confirm password; thành công hiển thị xác nhận rồi quay về login, điền email; không tự đăng nhập.
- Login: email đúng định dạng và password không rỗng; trả user với email đã nhập. Bỏ các input referral/phone chỉ phục vụ thử keyboard khỏi form login.
- Register/reset dùng password tối thiểu 8 ký tự, confirm phải khớp. Đây là quy tắc demo, không tuyên bố chính sách backend.
- Forgot: nhập email, trả thông báo trung tính thành công và nút tiếp tục đặt lại mật khẩu demo. Không gửi email hoặc SMS.
- Reset: dùng mock ticket trong bộ nhớ, gắn email, hết hạn sau 10 phút, dùng một lần và mất khi app restart; không nhận ticket bất kỳ từ deep link. Thành công quay về login với email đã nhập.
- Mock không tạo kho tài khoản và không lưu password. Register/reset mô phỏng kết quả; login vẫn chấp nhận dữ liệu hợp lệ theo validation. Các giới hạn này được ghi trong UI thành công và README để tránh hiểu nhầm mật khẩu đã được đổi thật.
- Có các scenario mock success, invalid-credentials, network-error và session-expired. Điều khiển bằng tiện ích demo development-only, không dùng magic email/password. Chọn scenario thủ công, giữ trong bộ nhớ; default success. Nút reset đưa về default.
- Mỗi form có validation, trạng thái đang gửi, ngăn submit trùng, thông báo lỗi và retry. Khôi phục field/error sau failure, không điều hướng khi thất bại.

### 5.3. API, config và kết thúc phiên

- models/common/apiResponse.ts là nguồn ApiResponse duy nhất. Dùng discriminated union để success bắt buộc data, failure có message và optional field errors/statusCode. Loại bỏ định nghĩa trùng hoặc re-export tạm nếu có consumer cần tương thích.
- Chuẩn hóa lỗi thành validation, unauthorized, forbidden, network, timeout, server, unknown. Storage error được phân biệt với network error.
- UI nhận message an toàn; chi tiết phục vụ debug không chứa credentials. Lỗi mạng/timeout có thể retry thủ công, không tự retry POST.
- HTTP layer gọi cơ chế session invalidation nhỏ có subscribe/unsubscribe, không import React provider. Chỉ invalidation 401 của request đã gửi kèm phiên hiện tại; 401 login/public request hoặc response của phiên cũ không logout phiên mới.
- Gom nhiều 401 đồng thời thành một lần kết thúc phiên, tránh nhiều thông báo/xóa storage.
- Request helper hỗ trợ bỏ auth cho public request và hủy request bằng AbortSignal. Không thêm refresh flow khi chưa có backend contract.
- Config đọc EXPO_PUBLIC_APP_ENV, EXPO_PUBLIC_AUTH_MODE và URL theo biến môi trường; có .env.example. Mặc định auth mode mock; giá trị thiếu/sai có thông báo rõ.
- Chỉ hỗ trợ auth mode mock trong đợt này. Nếu đặt mode khác, báo chưa được triển khai, không âm thầm fallback và không tạo endpoint giả.
- API/socket có thể chưa cấu hình khi chạy mock; không tự kết nối. Khi người dùng gọi tích hợp chưa cấu hình, trả lỗi có hướng dẫn.
- README hướng dẫn URL truy cập được từ máy Android/iOS thật, không mặc định localhost là máy development.

### 5.4. Shared UI và fallback

- Input: áp dụng className cho outer container, thêm inputClassName cho input, compose focus/blur callbacks; giữ tương thích React Hook Form. Có ref cho focus field và accessibility label tương ứng.
- SafeArea: truyền edges; màu tùy ý dùng style; ScreenContainer merge style với inset thay vì ghi đè vô tình.
- ScreenWrapper: cho cấu hình keyboard offset, keyboardShouldPersistTaps mặc định handled; xác định rõ màn nào sở hữu top/bottom inset để không cộng trùng với header/tab bar.
- Typography: explicit style có thể override kích thước mặc định; giới hạn scale theo độ rộng để tránh chữ tăng quá lớn trên tablet, vẫn tôn trọng font scaling hệ thống. Giữ token hiện tại, không redesign thương hiệu.
- Rà class không có token tùy chỉnh như secondary-* và destructive active color; thống nhất token thay vì thêm palette không dùng.
- Button/icon control: accessibility role/label/state, vùng bấm phù hợp, loading ngăn thao tác trùng; không tạo unhandled promise từ haptics.
- Modal: nội dung dài cuộn được, safe area đáy, đóng bằng Android Back, label nút đóng và xử lý keyboard.
- Có ErrorState với retry cho lỗi có thể phục hồi và root/route error fallback cho render error. Render fallback không thay thế catch lỗi async; reset UI không hứa khôi phục side effect.
- Không thêm global loading/error dùng chung cho mọi request. Duy trì loading/error tại nơi sở hữu thao tác; loại bỏ hoặc thu hẹp appStore hiện chưa có consumer, không giả vờ có online detection khi isOnline chỉ là boolean mặc định.
- app.json dùng light theme và status bar tương ứng. Native config thay đổi có thể cần rebuild development client; checklist nêu rõ.

### 5.5. Notifications và socket

- Provider mount chỉ đăng ký listener cần thiết và đọc trạng thái quyền; không tự hỏi quyền hoặc tự xin push token.
- Expose requestPermission/registerPush qua action của màn demo mobile, có loading/error/retry. Thiếu projectId không crash và không trả token giả; cho biết cần development build/cấu hình thật.
- Xử lý denied bằng hướng dẫn mở Settings, không hỏi quyền lặp vô hạn. Re-read permission khi app active.
- Notification tap chỉ hỗ trợ destination allowlist nội bộ: home hoặc account. Không router.push URL/path tùy ý từ payload.
- Cả tap lúc app đang mở và last response khi cold start được xử lý sau router/session initialization; deduplicate response, giữ một pending destination trong bộ nhớ lúc signed out, chạy sau login nếu hợp lệ.
- Logout xóa pending destination và push token trong bộ nhớ; chưa có API đăng ký/hủy token server nên không tuyên bố đã làm bước đó.
- Socket dùng một instance và một connect operation tại một thời điểm; reconnect dùng instance cũ. Disconnect hủy attempt hiện tại, remove listener đúng vòng đời, không để async connect cũ tạo socket sau logout.
- Socket lấy token hiện tại, không tự connect trong chế độ mock; thay phiên thì disconnect và cần explicit connect lại. Chưa thêm realtime feature.

### 5.6. Cấu trúc demo và tài liệu

- Di chuyển implementation dài của demo vào features/demo; app/ chỉ khai báo route/layout và render feature component.
- Shared UI vẫn ở components/ui; auth hooks/types/schemas/services/providers ở features/auth.
- README trình bày mobile-first, mock limitations, env, routes, đăng nhập/logout, notification setup và verification do người dùng chạy.
- PLAN-expo-starter-kit.md hiện là kế hoạch cũ, chứa src/ không tồn tại và hướng dẫn chạy verify không còn phù hợp. Gắn nhãn historical/superseded và trỏ tới tài liệu mới; không dùng nó ghi đè AGENTS.md.
- Rà script reset-project hiện tại: bỏ script khỏi package.json và xóa script cũ vì nó di chuyển/xóa shared folders nhưng không biết feature structure; hướng dẫn bắt đầu app mới bằng cách thay demo có kiểm soát.

### 5.7. Changelog và rule repository

- CHANGELOG.md ở root, viết tiếng Việt, mục [Unreleased] đứng đầu.
- Dùng Added, Changed, Fixed, Removed khi có nội dung; không tạo các mục rỗng.
- Chỉ ghi thay đổi đã triển khai trong lần cập nhật; không chép toàn bộ roadmap hoặc giả lập lịch sử trước đây.
- Ghi hành vi/tác động mà người dùng hoặc developer cần biết, gồm reset session cũ, route thay đổi và env cần cấu hình.
- AGENTS.md yêu cầu mọi đợt thêm tính năng, sửa lỗi hoặc thay đổi hành vi/config/public interface cập nhật changelog trong cùng đợt trước khi bàn giao.
- Thay đổi chỉ tài liệu/format không ảnh hưởng hành vi có thể không cần entry; không thêm entry cho việc chỉ lập plan.
- Không tự bump version hoặc chuyển Unreleased thành release nếu người dùng chưa yêu cầu.
- Giữ nguyên các rule phải duyệt plan, không commit và không tự chạy verify.

## 6. Các giai đoạn và vùng file dự kiến

Đây là phân chia thiết kế để chuẩn bị plan; danh sách file mới chính xác sẽ được chốt trong plan sau khi thiết kế được duyệt.

1. Foundation: utils/tokenService.ts và auth session service, lib/axios.ts, lib/api.ts, models/common/apiResponse.ts, lib/types/apiResponse.ts, lib/socket.ts; thiết kế lifecycle thống nhất trước khi nối UI.
2. Auth/navigation: features/auth/**, app/_layout.tsx, route auth mới, tab layout/home/account và demo group. Hoàn thiện mock và lỗi/restore/logout.
3. Config: constants/config.ts, .env.example, app.json; API/socket chỉ được gọi khi cấu hình đủ.
4. UI/integrations: components/ui/**, hooks/usePushNotifications.ts, context/NotificationProvider.tsx, features/demo/**; di chuyển màn demo và cập nhật imports.
5. Delivery: kiểm tra tập trung, checklist mobile, README.md, CHANGELOG.md, AGENTS.md, nhãn historical cho plan cũ, bỏ reset script không còn phù hợp.

Config cần cho auth/mock có thể được đặt trước phase 2 trong implementation plan. Changelog được cập nhật theo từng phase có thay đổi thực tế, không chờ toàn bộ hoàn tất.

## 7. Tiêu chí nghiệm thu và bằng chứng

- Fresh install đi vào login; session hợp lệ restore vào home; dữ liệu cũ/hỏng/hết hạn không mở màn riêng tư.
- Login/register/forgot/reset có success/error/loading; Back, deep link và logout tuân theo route guard.
- Storage failure không bị báo thành công; stale async response không tái tạo phiên sau logout.
- Nhiều 401 hiện tại chỉ invalidate một lần; 401 public hoặc từ phiên cũ không xóa phiên mới; timeout/network không logout.
- Input giữ callback/focus đúng, SafeArea edges/style có tác dụng, keyboard/modal/large font không che thao tác chính trên Android/iOS.
- Notifications không hỏi quyền lúc startup; denied, thiếu config, foreground/cold-start tap có fallback rõ ràng; socket không tạo instance trùng.
- Docs mô tả đúng mock và thay đổi cấu hình; AGENTS có rule changelog, Unreleased chỉ chứa việc đã làm.
- Bộ kiểm tra tự động nhỏ tập trung session races, storage failure, 401 deduplication, reset ticket và Input callback. Plan chọn công cụ tương thích dependency thực tế; không thêm test chỉ để kiểm tra implementation trivial.
- Không tự chạy hoặc cấu hình CI tự chạy các lệnh verify trong đợt này. Plan cung cấp command typecheck/lint/Expo compatibility và checklist/manual scenarios để người dùng chủ động chạy; test suite nếu được triển khai cũng chỉ cung cấp command.
- Chưa được coi là đã chứng minh ổn định runtime cho tới khi người dùng chạy checklist Android/iOS. Báo cáo cuối phân biệt thay đổi đã làm, kiểm tra chưa chạy và kết quả người dùng cung cấp.

## 8. Quyết định kỹ thuật do người viết đề xuất

Session envelope một key, bỏ legacy session, mock không lưu password/tài khoản, ticket demo trong bộ nhớ, allowlist notification, ApiResponse canonical ở models/common, bỏ reset script cũ và không cấu hình CI tự chạy là đề xuất của người viết để làm rõ cách triển khai. Người dùng có thể điều chỉnh khi duyệt thiết kế.

Thiết kế chưa chọn test runner/version, tên file helper cụ thể hoặc chi tiết layout từng form. Người lập plan quyết định những phần này dựa trên dependencies, pattern hiện hữu và phạm vi tối thiểu; không thay framework hoặc thêm backend.

## 9. Bước tiếp theo

Sau builder check, gửi thiết kế để người dùng duyệt. Sau khi duyệt mới áp dụng superpowers:writing-plans để tạo plan chi tiết theo file, dependency và bước nghiệm thu. Chưa sửa product code, CHANGELOG.md hoặc AGENTS.md trước khi plan triển khai được duyệt.
