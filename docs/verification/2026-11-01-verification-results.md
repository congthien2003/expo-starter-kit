# Kết quả verification — 2026-11-01

Người dùng đã cho phép agent chạy test/build/verify trực tiếp trong lần này, ghi đè giới hạn tự chạy của AGENTS.md cho yêu cầu hiện tại. Không sửa rule chung và không commit.

Môi trường: Windows, Node 26.7.0, npm 12.2.1, Expo 57.0.31, React Native 0.86.3, React 19.2.3.

## Kết quả thực tế

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| `npm run typecheck` | PASS, exit 0 | Không còn lỗi TypeScript, bao gồm test files |
| `npm run lint` | PASS, exit 0 | ESLint bao phủ app/components/features/constants/context/hooks/lib/models/utils và jest.setup; `--max-warnings=0` |
| `npm run test:unit` | PASS, exit 0 | 19/19 suites, 48/48 tests; lượt cuối 15.191 giây |
| `npm ls --depth=0` | PASS, exit 0 | Không có invalid/missing direct dependencies |
| `npx expo install --check` | PASS, exit 0 | Dependencies are up to date; đã chạy lại sau cập nhật lockfile |
| `npx --yes expo-doctor@latest` | PASS, exit 0 | 21/21 checks passed |
| Android production bundle/Hermes export | PASS, exit 0 | 1909 modules, 49 assets, HBC khoảng 5.4 MB |
| iOS production bundle/Hermes export | PASS, exit 0 | 1824 modules, 45 assets, HBC khoảng 5.2 MB |
| `git -c core.safecrlf=false diff --check` | PASS, exit 0 | Không còn trailing whitespace trong tracked diff |
| Dependency security audit | Còn findings | 64 tổng: 0 critical, 12 high, 45 moderate, 7 low |

Lệnh export thực tế:

```powershell
node node_modules/expo/bin/cli export --platform android --output-dir .expo/verify-export/android --max-workers 2
node node_modules/expo/bin/cli export --platform ios --output-dir .expo/verify-export/ios --max-workers 2
```

Artifact: `.expo/verify-export/android/metadata.json`, `.expo/verify-export/ios/metadata.json` và các HBC/assets tương ứng. `.expo/` là dữ liệu local bị gitignore, không được commit.

## Các lỗi tìm thấy và đã sửa

- TypeScript 6 không tự nạp Jest globals trong cấu hình hiện tại: khai báo types React/React Native/Node/Jest rõ ràng; giữ test files trong typecheck.
- Fixture NotificationResponse thiếu categoryIdentifier và badge không đúng kiểu SDK: dùng fixture có kiểu hợp lệ, không ép qua unknown để né lỗi.
- Reanimated mock vẫn khởi tạo native Worklets: thêm mock Worklets chính thức trước Reanimated. Font loading của icon được mock trong component tests để tránh async state update ngoài act.
- React Compiler lint phát hiện ghi SharedValue.value và setState đồng bộ trong effect: dùng SharedValue get/set; kiểm tra config qua state initializer, effect chỉ khôi phục external session/subscriptions.
- Lint cũ chỉ kiểm tra app/components: mở rộng đường dẫn sang toàn bộ implementation mới, sửa hết lỗi/warning thay vì tắt rule.
- Lệnh truyền `--runInBand` qua npm/PowerShell bị npm từ chối trước khi chạy Jest: đưa flag vào test script; `npm run test:unit` đã được chạy thành công thực tế.
- Xóa một trailing whitespace trong Input.

## Audit dependency

Audit ban đầu: 65 findings, có 1 critical ở shell-quote 1.8.3. Cập nhật riêng dependency gián tiếp bằng `npm update shell-quote --ignore-scripts --no-audit --no-fund`, lên 1.12.0 trong constraint hiện có; không thêm override, không force, không nâng Expo/React Native.

Audit sau cập nhật: **64 findings, 0 critical / 12 high / 45 moderate / 7 low**. Đây là findings của dependency tree gồm cả tooling, không phải bằng chứng rằng mọi finding đều khai thác được trong mobile bundle. Audit vẫn chưa sạch.

Nhóm high còn lại:

- `@expo/cli`, `zod` nằm trong Expo dependency tree: npm đề xuất thay Expo bằng major khác (thậm chí downgrade 51), chưa áp dụng.
- `expo-router`, `query-string`, `decode-uri-component`: npm đề xuất Router 58.0.29; chưa nâng riêng Router khỏi SDK 57.
- `brace-expansion`, `flatted`, `follow-redirects`, `node-forge`, `picomatch`, `socket.io-parser`, `ws`: audit báo có fix; chưa thực hiện cập nhật dependency hàng loạt trong đợt kiểm tra này.

Báo cáo JSON đầy đủ nằm local tại `.expo/npm-audit-final.json`; bản trước sửa tại `.expo/npm-audit.json`. Cần một đợt dependency remediation riêng để xử lý phần còn lại và nghiệm thu lại SDK/runtime, không dùng `npm audit fix --force`.

## Giới hạn build và runtime

- Đã bundle/minify và biên dịch Hermes bytecode cho Android/iOS; **chưa tạo APK/AAB hoặc iOS archive/IPA**.
- Android SDK path có `platforms/android-36`, nhưng thiếu `build-tools` và `platform-tools`. `java` trên PATH là Java 8 trong khi JAVA_HOME trỏ JDK 20; chưa chỉnh toolchain/global environment hoặc tải SDK tools tự động.
- Windows không có macOS/Xcode để build iOS archive/simulator.
- Chưa chạy trên emulator/thiết bị thật, chưa kiểm chứng keyboard/safe area/large font, native SecureStore, permission/push hoặc notification cold start trên thiết bị.
- Test mocks và Expo export không thay thế các bước native/device ở [checklist](mobile-base-stability.md).

Không có commit, merge, push, publish, tạo EAS project hoặc đổi app identity trong đợt này.
