# Execution ledger: 2026-11-01-mobile-base-stability.md

Thiết kế và implementation plan đã được người dùng duyệt. Thực hiện trực tiếp, branch feat/mobile-base-stability, không commit.

- Ruling: Làm trong checkout hiện tại trên branch riêng vì người dùng yêu cầu triển khai trực tiếp; không tạo worktree hoặc làm mất các tài liệu chưa commit.
- Ruling: Không chạy bất kỳ build/test/lint/verify nào theo AGENTS.md; test được viết nhưng không có bằng chứng RED/GREEN. Review cuối chỉ đọc source/diff.
- Ruling: Cài dependency với --ignore-scripts --no-audit --no-fund để tránh lifecycle scripts tự verify và audit ngoài yêu cầu; không nâng runtime dependencies.
- Task 1: implemented rule/changelog, jest-expo 57/Jest 29/RNTL 13; install hoàn tất, tests Not run.
- Task 2–4: implemented env/errors/ApiResponse/session manager/HTTP lifecycle; tests written, Not run.
- Task 5–8: implemented shared UI, auth mocks/forms, provider, guarded routes và feature demo; tests written, Not run.
- Task 9–10: implemented opt-in notifications, allowlisted pending navigation, socket lifecycle và bỏ appStore chưa dùng; tests written, Not run.
- Task 11: implemented README/checklist/changelog/history banner; bỏ reset script, không chạy script; checks Not run.
- Ruling: Dùng authMode thay auth trong request config vì Axios đã dùng auth cho HTTP Basic; không ghi đè kiểu/API của thư viện.
- Ruling: Root index chỉ làm redirect; tabs dùng /home và /account, demo có /demo prefix để tránh nhiều index trùng URL /.
- Ruling: Không gọi script automation của skill vì nó tự chạy test/commit; lưu ledger trực tiếp trong docs để giữ được bằng chứng khi chưa commit.
- Ruling: Jest renderer pin 19.2.3 bằng npm, không nâng React/Expo để theo hướng dẫn SDK 58.
- Review cuối: reviewer độc lập đọc source/diff, không chạy verify. Phát hiện 5 điểm; đã sửa trong một lượt và thêm test hồi quy, tests Not run.
- Final: fixed restore sau failed logout cleanup bằng guard cleanupError và bootstrap idempotent khi provider remount; test sessionManager restore cleanup debt và provider mount policy.
- Final: fixed notification cutoff dùng timestamp native chuẩn hóa seconds/ms, áp dụng live/cold và giữ cutoff trong session snapshot; thêm provider-level late callback/remount test.
- Final: fixed assertion storage envelope so sánh nội dung parsed JSON thay vì thứ tự key.
- Final: fixed Button long-label wrap và merged accessibility state; thêm test, không coi style assertion là bằng chứng layout trên thiết bị.
- Final: Ruling: Xử lý cả accessibility state finding trong lượt sửa vì busy/disabled semantics là yêu cầu của plan và ảnh hưởng screen reader; không để caller selected state ghi đè trạng thái thực tế.
- Final: Ruling: Các giới hạn rendering/keyboard/font/push/navigation timing/dependency compatibility và suite pass/fail chỉ người dùng có thể nghiệm thu bằng command/thiết bị; chưa có bằng chứng runtime, giữ Not run.
- Handoff: tất cả 11 task đã có implementation/tài liệu và command nghiệm thu. Không có bước verify nào đã chạy, không có commit/merge/push/release. Không dùng finishing workflow để tuyên bố tests pass hoặc tự tích hợp branch; bàn giao nguyên thay đổi trên feat/mobile-base-stability.
- Deferred minors: none. Không có vòng reviewer thứ hai; các sửa sau review chưa được chạy test.

## Điều chỉnh socket sau review của người dùng

- Người dùng duyệt giữ socket như module tùy chọn; xem `2026-11-01-optional-socket.md`, thay thế wiring socket trong plan cũ.
- Đã bỏ import/subscription socket khỏi root và bỏ socket khỏi core config/env mẫu/demo. `createSocketService` độc lập auth, cấu hình lazy và instance thuộc feature.
- Giữ socket.io-client cho helper mẫu; không tuyên bố đã gỡ dependency hay chứng minh tree shaking. Không cài dependency mới.
- Đã cập nhật test public/auth/instance/concurrency/config và README/changelog/checklist. Tests/build/lint/verify vẫn Not run; không commit.

## Verification được người dùng cho phép — 2026-11-01

- Người dùng yêu cầu trực tiếp chạy test/build/verify; giới hạn AGENTS.md được ghi đè cho lượt này, không sửa rule chung.
- Typecheck phát hiện Jest globals và fixture SDK sai kiểu; lint phát hiện React Compiler patterns; Jest UI thiếu Worklets mock. Đã sửa và chạy lại đạt typecheck/lint exit 0, 19 suites/48 tests pass.
- Expo install compatibility pass, doctor 21/21, npm ls depth 0 pass; Android/iOS production Hermes exports pass sau cập nhật dependency.
- Cập nhật riêng shell-quote 1.8.3 → 1.12.0 không force/override; audit 65 → 64, critical 1 → 0; còn 12 high/45 moderate/7 low, chưa remediation cả tree.
- Ruling: Chỉ thực hiện sửa lỗi verification và một dependency gián tiếp critical trong constraint; không nâng/downgrade Expo/Router bằng audit force.
- Ruling: Hermes export là bằng chứng bundling/bytecode, không gọi đó là APK/AAB/IPA hoặc device test. Native tools còn thiếu và Windows không build iOS archive.
- Kết quả/giới hạn đầy đủ ở docs/verification/2026-11-01-verification-results.md. Không commit.
