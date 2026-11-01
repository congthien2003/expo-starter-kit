# Socket tùy chọn — cập nhật phạm vi đã duyệt

Người dùng đã đồng ý đề xuất giữ module socket tùy chọn: gỡ wiring khỏi root, validate config khi feature dùng, truyền token từ feature và bỏ nội dung socket ở demo mặc định. Bản này thay thế phần socket gắn core trong thiết kế/plan mobile trước đó.

## Thay đổi theo file

1. `app/_layout.tsx`: bỏ socket import và subscription phiên; root chỉ giữ providers/navigation.
2. `constants/config.ts` và `.env.example`: bỏ socket khỏi core config và env mẫu mặc định; giá trị socket không ảnh hưởng bootstrap.
3. `lib/socket.ts`: export `createSocketService({ url?, getAccessToken? })`; mỗi feature có instance riêng. Không đọc authMode/sessionManager. Nếu thiếu url option, đọc EXPO_PUBLIC_SOCKET_URL khi connect; validate lúc đó. Không truyền callback thì public connection; callback có nhưng trả token rỗng thì unauthorized. Chia sẻ pending connect, hủy attempt cũ khi disconnect, không tự connect hoặc subscribe app state.
4. `lib/socket.test.ts`, `constants/config.test.ts`: kiểm tra lazy config, public/authenticated, instance isolation, concurrent connect, disconnect race và không chặn bootstrap. Viết test, không chạy theo AGENTS.md.
5. `features/demo/components/IntegrationsScreen.tsx`: chỉ còn notifications; README/checklist/changelog mô tả opt-in và feature chịu trách nhiệm logout/token change/unmount.

Giữ socket.io-client như dependency của helper mẫu; không có import từ app mặc định. Dự án không dùng có thể xóa helper/tests và uninstall dependency. Không tuyên bố package chưa cài hoặc đã chứng minh tree shaking.

Không commit, không tự build/test/lint/verify. User approval áp dụng phạm vi trên; triển khai trực tiếp theo lựa chọn đã có.

## Bàn giao

Đã viết implementation/tests và cập nhật tài liệu theo phạm vi trên. Reviewer độc lập chỉ đọc source, kết luận không thấy important issue trong delta socket tùy chọn. Không có test/build/lint/typecheck/verify nào được chạy, không có commit. Người dùng có thể chạy `npm run test:unit -- --runInBand lib/socket.test.ts constants/config.test.ts` và `npm run typecheck`.
