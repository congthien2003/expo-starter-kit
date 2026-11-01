# Mobile Base Stability Implementation Plan

> Socket scope update: người dùng đã duyệt [socket tùy chọn](2026-11-01-optional-socket.md). Kế hoạch đó thay thế phần root wiring, auth dependency và bootstrap socket config bên dưới.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax. User must approve this plan and select execution approach first. Repository constraints override skill defaults: no commits, no automatic verification.

**Goal:** Củng cố Expo source base cho Android/iOS với auth mock hoàn chỉnh, lifecycle nhất quán, shared UI ổn định và changelog bắt buộc.

**Architecture:** Giữ stack và cấu trúc feature hiện tại, triển khai tuần tự theo dependency. Auth sở hữu session/state; HTTP và socket chỉ sử dụng interface phiên, không import React provider. App Router giữ route mỏng, shared UI ở components/ui và implementation demo ở features/demo.

**Tech Stack:** Expo ~57.0.31, Expo Router ~57.0.29, React 19.2.3, React Native 0.86.3, TypeScript, NativeWind 4, Zod, React Hook Form, Axios, SecureStore; thêm bộ test tương thích SDK 57, không nâng runtime stack.

**Spec:** [Thiết kế đã được duyệt](../specs/2026-11-01-mobile-base-stability-design.md).

## Global Constraints

- Tạo source base dễ tái sử dụng cho Android và iOS.
- Giao diện sáng trong đợt này.
- Không triển khai hoặc kiểm thử web trong phạm vi đợt này; không cần xóa code web đang có.
- Không tự chạy build, test, lint hoặc lệnh verify. Cung cấp command/checklist để người dùng chạy.
- Không commit. Không tự đổi version hoặc tạo release.
- Không sửa product code trước khi người dùng approve implementation plan này.
- Không triển khai backend, email/SMS, social login, refresh endpoint, offline sync, OTA hoặc realtime business features.
- Không tạo folder rỗng, không thêm framework quản lý server state/toast/event tổng quát.
- Mỗi task có thay đổi thực tế phải cập nhật CHANGELOG.md; task chỉ viết test/docs không ảnh hưởng hành vi có thể không thêm entry.
- Các bước test dưới đây là viết test và bàn giao command; agent không chạy cả bước red lẫn green. Khi chưa có kết quả người dùng cung cấp, luôn ghi Not run.
- Dependency installation chỉ thực hiện sau approve plan. Dùng npm và package-lock.json; không đổi package manager, không giả lập lockfile, không force peer dependency.

## Review Focus

1. Logout trong lúc restore/login đang chờ: kết quả cũ không tái tạo phiên — Task 3 test deferred operations.
2. 401 đến muộn sau lần login mới: phiên mới không bị xóa, public 401 không logout — Task 4 test session revision.
3. SecureStore delete thất bại và nhiều 401 đồng thời: UI signed out một lần, báo cleanup error, có retry — Task 3/4.
4. Cold-start notification và logout khi đang chờ router: chỉ chạy một destination được phép, không mở lại pending từ phiên trước — Task 9.
5. Người dùng tăng font, dùng bàn phím và tablet: nút submit/đóng modal còn truy cập được, callback blur không mất — Task 5 và checklist mobile Task 11.

## File Map và thứ tự

| Vùng | File chính | Trách nhiệm |
|---|---|---|
| Repository rules | AGENTS.md, CHANGELOG.md | Chính sách và lịch sử thay đổi thực tế |
| Config/errors | constants/config.ts, lib/errors.ts, models/common/apiResponse.ts | Parse env, chuẩn lỗi/response |
| Auth core | features/auth/types/session.ts, services/sessionStorage.ts, services/sessionManager.ts | Storage envelope, revision, subscribe, expiry |
| HTTP | lib/axios.ts, lib/api.ts | Auth/public requests, normalized errors và 401 |
| UI | components/ui/input.tsx, safe-area.tsx, screen-wrapper.tsx, typography.tsx, button.tsx, modal.tsx | Props, insets, keyboard, accessibility |
| Auth mock | features/auth/services/mockAuthService.ts, mockScenarioService.ts, resetTicketService.ts | Kịch bản mô phỏng và ticket |
| Auth UI | features/auth/components/*Screen.tsx, schemas/*Schema.ts | Form và trạng thái thao tác |
| Navigation | app/_layout.tsx, app/index.tsx, app/(auth)/*, app/(tabs)/*, app/(demo)/* | Guards và route mỏng |
| Demo | features/demo/components/*Screen.tsx | Home/account/gallery/explore/modal và integrations demo |
| Notifications | context/NotificationProvider.tsx, hooks/usePushNotifications.ts, lib/notificationNavigation.ts | Permission, token, pending destination |
| Socket | lib/socket.ts | Singleton/attempt lifecycle |
| Delivery | README.md, docs/verification/mobile-base-stability.md, PLAN-expo-starter-kit.md | Hướng dẫn và bằng chứng chưa chạy |

Thứ tự bắt buộc: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11. Task 5/10 có thể độc lập về kỹ thuật nhưng không cần chạy song song. Không chia thành dự án độc lập vì cùng bàn giao một base với session lifecycle dùng chung.

---

### Task 1: Rule changelog và khung kiểm tra tập trung

**Files:** Create `CHANGELOG.md`, `jest.config.cjs`, `jest.setup.ts`; Modify `AGENTS.md`, `package.json`, `package-lock.json`.

**Interfaces:** Produces `npm run test:unit -- --runInBand [path]` (script `jest --watch=false`); preset jest-expo, alias `^@/(.*)$` → root; chỉ nhận `*.test.ts(x)` ngoài app/.

- [ ] Thêm mục Changelog vào AGENTS.md với exact rule: “Mỗi đợt thêm tính năng, sửa lỗi hoặc thay đổi hành vi/config/public interface phải cập nhật CHANGELOG.md trong cùng đợt trước khi bàn giao. Chỉ ghi thay đổi đã triển khai, mô tả tác động thực tế. Thay đổi chỉ tài liệu/format không ảnh hưởng hành vi có thể bỏ qua. Không tự bump version hoặc tạo release nếu người dùng chưa yêu cầu.” Giữ nguyên rule khác.
- [ ] Tạo CHANGELOG.md với heading, mô tả ngắn, `[Unreleased]` và `Added` ghi việc có changelog/rule. Không ghi các task chưa triển khai và không backfill lịch sử giả.
- [ ] Dùng `jest-expo` major 57, Jest/@types/jest theo peerDependencies thực tế của phiên bản preset được resolve; RNTL major 13 cho Router SDK 57 và `react-test-renderer` exact 19.2.3 tương ứng React. Cài bằng npm/Expo resolver, cập nhật lockfile bằng package manager, không chạy test/lint sau install. Nếu resolver báo incompatibility, dừng thay đổi dependency và báo rõ, không nâng Expo lên 58 để né lỗi.
- [ ] Cấu hình jest-expo, alias, mock SecureStore, AppState, haptics và Reanimated trong setup; fake timers chỉ trong test cần thời gian; reset mocks/subscriptions giữa test. Không cấu hình CI, watch mặc định, snapshots hoặc global coverage threshold.
- [ ] Bàn giao command `npm run test:unit -- --runInBand` cho người dùng; kỳ vọng các test được bổ sung trong task sau pass. Không tuyên bố test harness hoạt động trước khi người dùng chạy.

**Nguồn chọn công cụ:** [Expo unit testing](https://docs.expo.dev/develop/unit-testing/) và [Router testing: ghi chú SDK 57 dùng RNTL 13](https://docs.expo.dev/router/reference/testing/). Không copy requirement SDK 58/Jest 30 vào SDK 57. RNTL 13 dùng renderer cũ như một dependency test tương thích, không đưa renderer vào runtime app.

### Task 2: Config và contract lỗi/API duy nhất

**Files:** Modify `constants/config.ts`, `models/common/apiResponse.ts`, `lib/types/apiResponse.ts`, `.gitignore`, `app.json`; Create `.env.example`, `lib/errors.ts`, `constants/config.test.ts`, `lib/errors.test.ts`.

**Interfaces:**
- `AppConfig = { appEnv: 'development'|'staging'|'production'; authMode: 'mock'; apiUrl?: string; socketUrl?: string }`.
- `parseConfig(input: Record<string, string | undefined>): AppConfig`; `getConfig(): AppConfig`; `requireApiUrl(): string`; `requireSocketUrl(): string`.
- `AppError extends Error` có `kind: 'validation'|'unauthorized'|'forbidden'|'network'|'timeout'|'server'|'unknown'|'storage'|'configuration'|'cancelled'`, `statusCode?: number`, `fieldErrors?: Record<string,string[]>`; `normalizeError(error: unknown): AppError`.
- `ApiResponse<T> = { isSuccess:true; data:T; statusCode?:number; message?:string } | { isSuccess:false; message:string; statusCode?:number; fieldErrors?:Record<string,string[]> }`.

- [ ] Viết test: env mặc định development/mock; staging được chọn; env/mode lạ báo configuration error; URL thiếu được phép ở mock startup nhưng require* báo lỗi; URL không phải http(s) báo lỗi. Production không âm thầm chọn development.
- [ ] Viết test: timeout khác network; AbortSignal cancellation có kind cancelled; 401/403/5xx map đúng; unknown dùng thông báo an toàn, không render payload/error stack từ server.
- [ ] Đọc `process.env.EXPO_PUBLIC_APP_ENV`, `EXPO_PUBLIC_AUTH_MODE`, `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SOCKET_URL` bằng property tĩnh để Expo inline; parse bằng pure helper. .env.example để URL trống, có chú thích dùng IP LAN cho thiết bị thật. Gitignore local env thực tế, cho phép .env.example.
- [ ] Dùng ApiResponse canonical trong models/common; lib/types/apiResponse.ts chỉ re-export type tạm để không làm hỏng imports; giữ export ApiError tương thích shape failure. Không thay pagination không liên quan.
- [ ] Đặt `userInterfaceStyle: 'light'` trong app.json. Parse env qua getConfig khi bootstrap/request, không throw ở module import khiến ErrorBoundary chưa mount. Axios instance tạo không cần URL, request interceptor mới requireApiUrl; mock auth không import module tự gọi API.
- [ ] Cập nhật changelog Changed/Fixed cho config và contract; bàn giao `npm run test:unit -- --runInBand constants/config.test.ts lib/errors.test.ts`.

### Task 3: Session envelope, revision và lifecycle dùng chung

**Files:** Create `features/auth/types/session.ts`, `features/auth/services/sessionStorage.ts`, `features/auth/services/sessionManager.ts`, `features/auth/services/sessionStorage.test.ts`, `features/auth/services/sessionManager.test.ts`; Modify `utils/tokenService.ts`, `features/auth/types/auth.ts`.

**Interfaces:**
- `SessionV1 = { version:1; user:User; accessToken:string; refreshToken?:string; expiresAt:number }`; expiresAt Unix milliseconds.
- `SessionSnapshot = { status:'booting'|'signed-out'|'authenticated'|'restore-error'; session:SessionV1|null; revision:number; error:AppError|null; cleanupError:AppError|null }`.
- `sessionStorage.read(): Promise<SessionV1|null>`, `.write(session:SessionV1): Promise<void>`, `.clear(): Promise<void>`; key `auth_session_v1`; validation schema không export secrets ra logs.
- `sessionManager.getSnapshot(): SessionSnapshot`, `.subscribe(listener:()=>void):()=>void`, `.restore():Promise<void>`, `.startOperation():number`, `.commitSession(session:SessionV1, operation:number):Promise<boolean>`, `.isCurrent(operation:number):boolean`, `.invalidate(reason:'logout'|'expired'|'unauthorized', expectedRevision?:number):Promise<void>`, `.retryCleanup():Promise<void>`, `.checkExpiry(now?:number):Promise<void>`.

- [ ] Viết test storage: empty, round trip, malformed JSON/schema, unknown version, expiry boundary `now >= expiresAt`; mock read/write/delete reject phải trả storage error, không biến thành null/success.
- [ ] Viết test legacy: không đọc user/token cũ làm phiên hợp lệ; xóa access_token, refresh_token, stored_user; cleanup thất bại báo lỗi và không restore phiên cũ. Clear thử tất cả key dù một key lỗi.
- [ ] Viết test race bằng deferred promises: restore→logout, login A→login B, login→logout khi storage write đang chờ; kết quả cũ không publish hoặc để lại session cũ làm phiên restore lần sau.
- [ ] Implement storage ghi một envelope JSON. Serialize storage mutations trong manager; invalidate tăng revision và chuyển signed-out trước await, cleanup xếp sau write đang chạy. commit stale không xóa session mới; chỉ task sở hữu revision được publish.
- [ ] Viết test invalidate đồng thời và cleanup retry: một lifecycle transition, cleanupError tách riêng, retry không đăng nhập lại. AppState check hết hạn một giờ; mất mạng không tự invalidate.
- [ ] `utils/tokenService.ts` trở thành compatibility adapter sang manager/storage, không sở hữu session thứ hai. Getters chỉ trả token còn hiệu lực. Xóa các setter riêng/setUser sau khi chuyển hết consumer nội bộ; không để cách ghi nhiều key cũ tiếp tục tạo phiên nửa chừng. Không có public API bên ngoài repo cần duy trì setter cũ.
- [ ] Cập nhật changelog về session v1, fail-closed và yêu cầu login lại; bàn giao `npm run test:unit -- --runInBand features/auth/services/sessionStorage.test.ts features/auth/services/sessionManager.test.ts`.

### Task 4: HTTP đồng bộ phiên và chuẩn hóa lỗi

**Files:** Modify `lib/axios.ts`, `lib/api.ts`; Create `lib/axios.test.ts`.

**Interfaces:** Consumes Task 2/3. Produces `ApiRequestConfig extends AxiosRequestConfig` với `auth?: 'required'|'none'` (default required), sử dụng `signal` của Axios. Public helpers giữ `api.get<T>(url, config?)`, `post/put/patch<T>(url,data?,config?)`, `delete<T>(url,config?)` trả `Promise<T>` và reject AppError.

- [ ] Viết test bằng Axios adapter stub, không mạng thật: public request không có bearer; authenticated request lấy session hiện tại, không gửi token hết hạn; timeout 15000ms được giữ.
- [ ] Viết test 401: 5 response cùng revision chỉ invalidate một lần; 401 của public request không invalidate; response revision A không xóa revision B. Assertion network/timeout/403 không logout.
- [ ] Gắn revision request vào internal config, strip custom auth option trước adapter. Trước dispatch dùng requireApiUrl và checkExpiry; reject thiếu phiên bằng AppError unauthorized mà không gọi mạng.
- [ ] Request absolute URL chỉ được dùng khi cùng origin API đã cấu hình; chặn origin khác trước khi gắn bearer để tránh rò token. Test foreign absolute URL không gửi Authorization; public external URL cũng không đi qua API helper này.
- [ ] Response interceptor normalize error, invalidate có expectedRevision. Tách cleanup error khỏi lỗi HTTP gốc, không log token/header. Không import AuthProvider, không refresh endpoint, không retry POST.
- [ ] Cập nhật changelog; bàn giao `npm run test:unit -- --runInBand lib/axios.test.ts`.

### Task 5: Sửa shared UI cho form và mobile layout

**Files:** Modify `components/ui/input.tsx`, `safe-area.tsx`, `screen-wrapper.tsx`, `typography.tsx`, `button.tsx`, `modal.tsx`, `quantity-input.tsx`, `empty-state.tsx`, `index.ts`, `tailwind.config.js`; Create `components/ui/input.test.tsx`, `components/ui/safe-area.test.tsx`, `components/ui/modal.test.tsx`.

**Interfaces:** `Input` forwardRef<RNTextInput>, `className` outer container, `inputClassName` RN input; InputProps giữ TextInputProps. ScreenWrapper thêm `keyboardVerticalOffset?:number`, `keyboardShouldPersistTaps?:'always'|'never'|'handled'` default handled; giữ props cũ. Modal giữ interface hiện tại, thêm `scrollable?:boolean` default true.

- [ ] Viết test Input: focus/blur vừa đổi state nội bộ vừa gọi callback đúng một lần, RHF touched sau blur, outer/input class đúng nơi, ref.focus dùng được; password toggle có label và disabled không cho toggle.
- [ ] Viết test SafeArea: edges truyền nguyên vẹn, backgroundColor nhận HEX qua style, custom style không làm mất inset mặc định; cho phép override explicit padding có chủ đích bằng style cuối.
- [ ] Implement callback composition và ref; a11y input dùng accessibilityLabel caller hoặc label, toggle/nút icon có label, disabled/busy state và hitSlop.
- [ ] Typography dùng base size hiện tại, scale theo `min(1.15,max(0.9,width/375))` với useWindowDimensions; giữ allowFontScaling mặc định. Đổi thứ tự style để caller style cuối có thể override fontSize. Không tắt font scaling hệ thống.
- [ ] ScreenWrapper/Modal xử lý keyboard props, scroll nội dung và bottom inset. Modal test onRequestClose gọi onClose, backdrop đóng đúng prop; manual kiểm tra scroll và keyboard trên hai OS.
- [ ] Thay secondary-* không định nghĩa bằng neutral tokens phù hợp; bổ sung danger-600 nếu Button destructive cần; dùng token dùng chung cho màu icon thay vì palette mới. Button catch haptics rejection, không đổi onPress semantics.
- [ ] Cập nhật changelog; bàn giao `npm run test:unit -- --runInBand components/ui` và checklist font scale 100%/150%/200%, portrait/landscape/tablet, keyboard mở và Android Back.

### Task 6: Mock service và reset ticket có kịch bản rõ ràng

**Files:** Create `features/auth/services/mockAuthService.ts`, `mockScenarioService.ts`, `resetTicketService.ts`, `mockAuthService.test.ts`, `resetTicketService.test.ts`; Modify `features/auth/services/authService.ts`, `features/auth/types/auth.ts`; Create `features/auth/schemas/registerSchema.ts`, `forgotPasswordSchema.ts`, `resetPasswordSchema.ts`, `authSchemas.test.ts`.

**Interfaces:**
- `MockScenario = 'success'|'invalid-credentials'|'network-error'|'session-expired'`; scenario service `getSnapshot()`, `subscribe(listener)`, `set(scenario)`, `reset()`; set/reset chỉ có hiệu lực __DEV__.
- `authService.login(payload:LoginRequest):Promise<ApiResponse<LoginResponse>>`, `.register(payload:{fullName:string;email:string;password:string}):Promise<ApiResponse<{email:string}>>`, `.forgotPassword(payload:{email:string}):Promise<ApiResponse<{email:string;ticket:string}>>`, `.resetPassword(payload:{ticket:string;password:string}):Promise<ApiResponse<{email:string}>>`, `.getMe():Promise<ApiResponse<User>>`.
- LoginResponse giữ accessToken/user/expiresIn=3600, refreshToken optional. Provider chuyển LoginResponse thành SessionV1; service không ghi storage.
- Ticket service `.issue(email:string,now?:number):string`, `.consume(ticket:string,now?:number):string` trả email hoặc throw validation error; ttl=600000ms.

- [ ] Viết test schema: email trim/format, register fullName trim không rỗng, password 7 fail/8 pass, confirm mismatch fail; login không bắt buộc password 8; forgot/reset email/ticket không rỗng.
- [ ] Viết test mock scenarios: success echo normalized email; invalid-credentials chỉ login trả failure; network-error reject network AppError cho thao tác async; session-expired tạo login response expiresIn=0 để manager không commit. Không chờ delay thật trong test.
- [ ] Viết test ticket: fake clock đến đúng 10 phút bị từ chối, dùng lại bị từ chối, ticket không tồn tại bị từ chối; issue mới cho cùng email vô hiệu ticket cũ; không serialize password/ticket ra storage hay log.
- [ ] Implement mock giới hạn một ticket hiện tại, không account database, không persist password; register/reset chỉ mô phỏng, delay mặc định 800ms. getMe trả user phiên còn hạn hoặc unauthorized response.
- [ ] authService chỉ chọn mock và thông báo configuration error cho mode chưa hỗ trợ; bỏ MOCK_USER cố định không theo email. Expose scenario utility cho màn demo, không thêm điều khiển scenario vào production UI.
- [ ] Cập nhật changelog Added auth mocks/Changed persistence; bàn giao `npm run test:unit -- --runInBand features/auth/services/mockAuthService.test.ts features/auth/services/resetTicketService.test.ts features/auth/schemas/authSchemas.test.ts`.

### Task 7: Provider và fallback startup/render error

**Files:** Modify `features/auth/providers/AuthProvider.tsx`, `hooks/useAuth.ts`, `types/auth.ts`, `index.ts`; Create `features/auth/providers/AuthProvider.test.tsx`, `components/ui/error-state.tsx`, `components/app-error-boundary.tsx`, `features/auth/components/AuthBootstrap.tsx`; Modify `components/ui/index.ts`.

**Interfaces:** Auth context có `user:User|null`, `isAuthenticated:boolean`, `isBootstrapping:boolean`, `sessionError:AppError|null`, `cleanupError:AppError|null`, `login(email,password):Promise<ApiResponse<User>>`, `logout():Promise<void>`, `refreshUser():Promise<void>`, `retryRestore():Promise<void>`, `retryCleanup():Promise<void>`. Không global isLoading cho form; RHF isSubmitting sở hữu request UI. `ErrorState({title,description?,actionLabel?,onRetry?})`; AuthBootstrap nhận children.

- [ ] Viết test provider: booting không hiện private content; login thành công chỉ publish sau write; storage write lỗi trả failure; logout race theo Task 3 không hồi sinh user; unmount không giữ listener AppState.
- [ ] Subscribe manager qua useSyncExternalStore; restore idempotent khi mount; AppState active gọi checkExpiry. Form action lấy operation id, gọi mock service rồi commit; ignore stale result và không báo success khi session hết hạn ngay.
- [ ] refreshUser chỉ cập nhật snapshot nếu revision còn đúng; lưu cập nhật user qua cùng commit path, không tự ghi storage từ provider. Giữ login/logout side effects ở manager, không navigate trong service.
- [ ] AuthBootstrap hiển thị Loading hoặc ErrorState khi restore/config lỗi, có retry và clear-session; cleanupError có cảnh báo retry ngoài private content. Boundary bắt render error, fallback safe và reset bằng remount subtree, không tự retry request hay log sensitive payload.
- [ ] Cập nhật export/import consumers trong cùng task để không còn isLoading cũ hoặc Promise<boolean> bị dùng nhầm; có thể giữ LoginScreen tối thiểu compiling cho tới Task 8.
- [ ] Cập nhật changelog; bàn giao `npm run test:unit -- --runInBand features/auth/providers/AuthProvider.test.tsx`.

### Task 8: Auth screens, protected routes và demo feature

**Files:** Create `app/index.tsx`, `app/(auth)/_layout.tsx`, `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/(auth)/forgot-password.tsx`, `app/(auth)/reset-password.tsx`, `app/(tabs)/account.tsx`, `app/(demo)/_layout.tsx`, `app/(demo)/demo/index.tsx`, `app/(demo)/demo/components.tsx`, `app/(demo)/demo/explore.tsx`, `app/(demo)/demo/finance-home.tsx`; Modify `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/modal.tsx`; Rename `app/(tabs)/index.tsx` → `app/(tabs)/home.tsx`.
- Create `features/auth/components/RegisterScreen.tsx`, `ForgotPasswordScreen.tsx`, `ResetPasswordScreen.tsx`; Modify `features/auth/components/LoginScreen.tsx`, `features/auth/index.ts`.
- Create `features/demo/components/HomeScreen.tsx`, `AccountScreen.tsx`, `DemoIndexScreen.tsx`, `ComponentsDemoScreen.tsx`, `ExploreScreen.tsx`, `FinanceHomeScreen.tsx`, `ModalScreen.tsx`, `features/demo/index.ts`.
- Delete old routes `app/(tabs)/demo-login.tsx`, `demo-home.tsx`, `components-demo.tsx`, `explore.tsx` after moving implementation/updating all links.
- Create `features/auth/components/authScreens.test.tsx`, `features/auth/navigation.test.tsx` (tests ngoài app/).

**Interfaces:** Root index `/` chỉ làm entry. (tabs) có Home `/home` và Account `/account`; link nội bộ dùng `/(tabs)/home` và `/(tabs)/account`. Demo có URL prefix `/demo` bằng directory `app/(demo)/demo/`; không tạo `app/(demo)/index.tsx`. Public route `/login`, `/register`, `/forgot-password`, `/reset-password`. Mỗi URL có một route, không tạo nhiều index cùng ánh xạ `/`.

- [ ] Viết route test bằng expo-router/testing-library SDK57: initial signed-out→login; authenticated→home; private deep link signed-out→login; login/public group không còn reachable sau auth; logout từ modal/demo không Back về private.
- [ ] Làm root Stack.Protected cho (auth) và (tabs)/(demo)/modal; root index redirect theo session sau AuthBootstrap. Đổi `(tabs)/index.tsx` thành `(tabs)/home.tsx` thin route render HomeScreen; không giữ hai home index xung đột. Stack options modal ở root, ModalScreen implementation ở feature demo.
- [ ] Di chuyển UI demo hiện tại vào feature, không redesign finance demo. Home đơn giản hiển thị user và link gallery; Account có logout/retry cleanup và link mock scenarios __DEV__. DemoIndex có liên kết components/explore/finance/integrations.
- [ ] Làm LoginScreen chỉ email/password, show banner “Chế độ demo — không xác thực với máy chủ”, dùng RHF isSubmitting và field errors; action login success router.replace về home nếu guard chưa chuyển. Có labels và link register/forgot với onPress thật.
- [ ] Làm register/forgot/reset theo schema/service Task 6; success dùng nội dung tại chỗ, không thêm route chỉ để báo thành công. Register success→login?email=...; forgot success→reset-password?ticket=...&email=...; reset ticket phải được service xác nhận trong bộ nhớ, không tin email query; reset success→login.
- [ ] UI register/reset hiển thị “Đây là mô phỏng; không tạo tài khoản hoặc thay đổi mật khẩu thật.” Không log query ticket. Ticket thiếu/hết hạn có action quay forgot, không có form submit giả thành công.
- [ ] Test duplicate submit, validation, register không auto-login, expired ticket, network retry giữ email và password ở form hiện tại nhưng không persist/log. Login/register screen text thống nhất tiếng Anh theo UI hiện hữu; câu mô tả ở trên là ý nghĩa bắt buộc, dịch tương ứng trong app; README/changelog tiếng Việt.
- [ ] Cập nhật mọi link cũ trong demo, README route table và changelog Removed/Changed. Bàn giao `npm run test:unit -- --runInBand features/auth/components/authScreens.test.tsx features/auth/navigation.test.tsx`.

### Task 9: Notifications chủ động và điều hướng an toàn

**Files:** Modify `hooks/usePushNotifications.ts`, `context/NotificationProvider.tsx`, `app/_layout.tsx`; Create `lib/notificationNavigation.ts`, `lib/notificationNavigation.test.ts`, `hooks/usePushNotifications.test.tsx`, `features/demo/components/IntegrationsScreen.tsx`, `app/(demo)/demo/integrations.tsx`.

**Interfaces:** notification state giữ token/notification/permissionStatus và thêm `isRegistering:boolean`, `error:AppError|null`, `requestPermission():Promise<void>`, `registerPush():Promise<void>`, `openSettings():Promise<void>`; no token request at mount. `parseNotificationDestination(data:unknown):'home'|'account'|null`; payload chỉ `{screen:'home'|'account'}`.

- [ ] Test mount không requestPermissions/getExpoPushToken; denied không lặp prompt, có openSettings; thiếu projectId giữ permission status nhưng token undefined; network/native error trả error và retry được.
- [ ] Test response queue: cold-start đợi initialization, duplicate response cùng request id/action chỉ navigate một lần, payload URL/unknown screen bị bỏ qua, signed-out giữ một destination, logout clear pending. New notification sau logout có thể tạo pending mới, response trước logout không được nạp lại từ last response.
- [ ] Parse payload allowlist; navigation coordinator dùng session revision và consumed response id trong bộ nhớ, check response timestamp trước invalidation để không phát lại cũ. Khi được hỗ trợ gọi clearLastNotificationResponseAsync sau consume; lỗi clear không được phá dedup trong process.
- [ ] Provider đăng ký listener và đọc permissions; cold-start đọc last response, đợi navigation ready và boot xong. Người dùng signed out vẫn thấy login; sau login ưu tiên destination notification hợp lệ, còn deep link thường về home theo thiết kế.
- [ ] IntegrationsScreen có action xin quyền/đăng ký push/mở Settings và hiển thị status; không hiện/log token nguyên vẹn. Root subscribe logout để clear token/pending; remove listeners/AppState khi unmount.
- [ ] Cập nhật changelog; bàn giao `npm run test:unit -- --runInBand hooks/usePushNotifications.test.tsx lib/notificationNavigation.test.ts` và kịch bản thiết bị thật ở Task 11.

### Task 10: Socket singleton, disconnect và dọn store không dùng

**Files:** Modify `lib/socket.ts`, `app/_layout.tsx`, `features/demo/components/IntegrationsScreen.tsx`; Create `lib/socket.test.ts`; Delete `stores/appStore.ts`, `stores/index.ts` nếu vẫn không có consumer sau Task 8/9.

**Interfaces:** Giữ `socketService.connect():Promise<Socket>`, `.disconnect():void`, `.getSocket():Socket|null`, `.emit(event:string,data?:unknown):void`, `.on(event:string,callback:(...args:unknown[])=>void):void`, `.off(event:string,callback?:(...args:unknown[])=>void):void`. connect resolve khi instance đã được tạo/đã gọi connect, không hứa đã nhận event connected; missing config/auth reject AppError, mock mode reject configuration error.

- [ ] Test hai connect đồng thời trả cùng instance/promise, reconnect dùng instance cũ; disconnect khi đang await token/session ngăn io được gọi sau đó; phiên đổi disconnect socket và callbacks cũ không hoạt động.
- [ ] Dùng attempt generation + shared pending promise; acquire session snapshot trước connect, kiểm tra revision sau await. Không tự connect khi provider mount. Client auth token không lưu trong logs.
- [ ] Hook session invalidation qua subscribe với unsubscribe rõ ràng tại root lifecycle (không tạo circular import sessionManager↔socket); root disconnect khi revision/identity đổi hoặc signed-out, không disconnect do update user cùng phiên.
- [ ] IntegrationsScreen chỉ giải thích socket chưa bật ở mock, không gọi endpoint giả. Nếu không có consumer appStore thì xóa file/export, giữ dependency Zustand hiện có để không mở rộng scope cleanup packages.
- [ ] Cập nhật changelog; bàn giao `npm run test:unit -- --runInBand lib/socket.test.ts`.

### Task 11: Hướng dẫn bàn giao, checklist và cleanup script cũ

**Files:** Modify `README.md`, `PLAN-expo-starter-kit.md`, `package.json`, `package-lock.json`, `CHANGELOG.md`; Delete `scripts/reset-project.js`; Create `docs/verification/mobile-base-stability.md`.

**Interfaces:** Tài liệu phân biệt Implemented / Not run / User-reported results. Không release version mới; Unreleased đứng đầu và không có category rỗng.

- [ ] README cập nhật mobile-first, feature tree thực tế, routes cuối cùng, env/mock limitations, session v1/legacy login lại, các scenario, notifications allowlist và lỗi storage có thể còn dữ liệu khi delete thất bại.
- [ ] Bỏ reset-project script và file JS cũ; hướng dẫn thay demo feature có kiểm soát. Không chạy script. Plan cũ thêm banner “Historical / Superseded” trỏ thiết kế/plan mới và AGENTS.md, giữ nội dung lịch sử bên dưới.
- [ ] Tổng hợp CHANGELOG chỉ việc đã triển khai; nêu breaking developer changes: routes, auth context, ApiResponse, setters tokenService và env. Rule AGENTS đã có từ Task 1 và vẫn giữ nguyên cấm tự verify/commit.
- [ ] Tạo bảng checklist sau, mọi ô bắt đầu Not run: Android emulator; Android thật; iOS simulator; iPhone thật; tablet/large font. Windows không chạy iOS simulator local, người dùng cần Mac hoặc thiết bị/build phù hợp.
- [ ] Kịch bản auth: fresh install, restore, expiry/foreground, legacy/corrupt session, storage read/write/delete reject, retry cleanup, 401 đồng thời/stale/public, login/logout race, deep link private, modal/logout/Back, forgot ticket hết hạn/consume/restart.
- [ ] Kịch bản UI: input callback/ref, submit khi keyboard mở, mật khẩu ẩn/hiện, font 100/150/200%, tablet, modal dài + Back, inset không trùng tab bar; notification startup không prompt, granted/denied/missing EAS/network, foreground/tap/cold-start/logout pending; mock socket không tự connect.
- [ ] Bàn giao các command sau cho người dùng, không chạy và không tự tạo CI workflow:

```powershell
npm run typecheck
npm run lint
npm run test:unit -- --runInBand
npx expo install --check
npx expo-doctor@latest
npm audit
npx expo start --clear
```

Expected: typecheck/lint exit 0; test assertions pass; Expo checks không có mismatch cần xử lý; audit được review riêng, không force fix; app chạy qua checklist trên Android/iOS. Expo Go không đủ để xác nhận push: cần development build và native credentials/projectId thật. Không tự thêm build identity/EAS project hoặc build/publish app cho người dùng.

## Self-review của plan

- Spec coverage: session/storage→3/7; auth/routes→6/8; API/config→2/4; shared UI/errors→5/7; notifications/socket→9/10; architecture/docs/changelog/reset→1/8/11; kiểm tra và bằng chứng→mọi task +11.
- Type consistency: SessionV1/Snapshot/manager dùng thống nhất giữa HTTP/provider/socket; auth service trả ApiResponse, context login trả ApiResponse<User>; form dùng RHF isSubmitting.
- Review Focus được gắn test/checklist cụ thể; không thay chạy thật bằng đọc test code.
- Test setup gộp vào task repository foundation, không tạo CI tự verify. Không có bước commit hoặc nâng Expo.
- Plan không phải bằng chứng pass; implementation hoàn tất và runtime đã kiểm tra là hai trạng thái khác nhau.

## Approval và execution handoff

Chờ người dùng duyệt plan và chọn cách triển khai. Đề xuất Native: thực hiện tuần tự trong session vì auth/session/HTTP/navigation chia sẻ interface và dependency, sau đó reviewer độc lập đọc toàn bộ diff. Nếu chọn Subagent-driven, giao từng task cho worker và reviewer riêng, tôn trọng cùng constraints không chạy verify.

Không triển khai trước khi nhận approve plan. Khi bắt đầu dùng skill execution tương ứng; không thể tự đổi runtime collaboration mode từ tài liệu này, nên nếu harness chưa ở Plan mode thì không tuyên bố đã chuyển mode.
