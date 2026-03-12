# Project Plan: Expo Starter Kit Design & Notification Setup

## Overview
Cập nhật design guideline (màu sắc, spacing, typography, shadow) cho Expo starter-kit theo file `/docs/DESIGN_GUIDELINE.md`. Áp dụng responsive design sử dụng `react-native-size-matters` cho tất cả component hiện có tại trang demo. Ngoài ra, thiết lập Notification local thông qua cơ chế Context của `expo-notifications`, và cuối cùng cập nhật thông tin chuẩn meta (package.json, readme, logger) cho một starter-kit.

## Project Type
**MOBILE** (Sử dụng `mobile-developer` agent trong suốt quá trình phát triển).

## Success Criteria
1. `tailwind.config.js` được config khớp 100% với biến màu, viền, shadow trong Design Guideline.
2. Tất cả chữ viết (Typography) đều phải đi qua cơ chế scale của `react-native-size-matters` (kết hợp với Tailwind config/NativeWind tuỳ biến).
3. Mọi view/component trong Screen demo đã nhận diện cấu hình mới và render chuẩn chỉnh.
4. Có Notification Context & hooks (Push Notification handler) setup sẵn sàng, chỉ cần truyền config server push về sau.
5. README.md và `package.json` phản ánh rõ ràng tính năng của Starter Kit.
6. Phase X Verification script pass thành công.

## Tech Stack
- Framework: React Native (Expo)
- Styling: NativeWind / TailwindCSS
- Responsive: `react-native-size-matters` (Scale theo kích thước thiết bị màn hình)
- Push Notifications: `expo-notifications` (Thiết lập client base event & token)

---

## File Structure
Dự án được bổ sung/cập nhật qua các luồng chính:
```
├── src/
│   ├── components/
│   │   ├── ... (Các UI component hiện có tại demo)
│   ├── context/
│   │   └── NotificationProvider.tsx (Push notification context/handler)
│   ├── hooks/
│   │   └── usePushNotifications.ts (Custom hooks)
│   ├── screens/
│   │   └── DemoScreen.tsx (Màn hình Demo apply UI mới)
├── tailwind.config.js (Base styling rules được override)
├── package.json (Được dọn dẹp và mô tả lại)
└── README.md (Hướng dẫn sử dụng)
```

---

## Task Breakdown

### 1. Cấu hình cốt lõi UI (Config Base)
* **Agent:** `mobile-developer`
* **Skills:** `mobile-design`, `clean-code`
* **Path:** `tailwind.config.js` (hoặc nơi tuỳ biến UI plugin)
* **INPUT:** `/docs/DESIGN_GUIDELINE.md` nội dung cấu hình.
* **OUTPUT:** `tailwind.config.js` được cập nhật theme (colors, spacing, shadows, border-radius) + cài đặt thư viện `react-native-size-matters`.
* **VERIFY:** Build không lỗi type tailwind.

### 2. Refactor hệ thống Typography & Components chính
* **Agent:** `mobile-developer`
* **Skills:** `mobile-design`, `clean-code`
* **Path:** `src/components/*`
* **INPUT:** Các component hiện có trong màn demo.
* **OUTPUT:** Áp dụng scale (`s`, `vs`, `ms` của `react-native-size-matters`) kết hợp tailwind. Viết lại CSS properties/classes liên đới.
* **VERIFY:** Size tự co giãn linh động tuỳ biến vào device khi test và text scale component load chuẩn không lỗi prop.

### 3. Cập nhật giao diện vào Screen Demo
* **Agent:** `mobile-developer`
* **Skills:** `mobile-design`
* **Path:** `src/screens/(ví dụ DemoScreen)`
* **INPUT:** Giao diện Demo page hiện tại.
* **OUTPUT:** Bọc lại screen sử dụng các Component đã được refactor tại Task 2; kiểm tra màu của `primary-500`, heading text tuân thủ chuẩn mới.
* **VERIFY:** Screen compile trực quan đúng màu sắc, scale.

### 4. Triển khai Push Notification Setup (Local Base)
* **Agent:** `mobile-developer`
* **Skills:** `mobile-design`, `clean-code`
* **Path:** `src/context/NotificationProvider.tsx` & `src/hooks/usePushNotifications.ts`
* **INPUT:** Thư viện `expo-notifications`.
* **OUTPUT:** Chứa function request permission (`expo-device`, `expo-notifications`), get token, listener handle foreground message và background response. Provide xuống App bằng Context.
* **VERIFY:** Hooks có thể xuất được Push Notification Token khi App Mount.

### 5. Dọn dẹp & Tối ưu hoá dự án Starter Kit
* **Agent:** `project-planner` / `orchestrator`
* **Skills:** `clean-code`, `documentation-templates`
* **Path:** `package.json`, `README.md`, logs code.
* **INPUT:** Các config boilerplate của dự án.
* **OUTPUT:** Update script `package.json` + dependencies, chỉnh sửa thông tin tên project. Document lại README rõ ràng cách dùng components, notifications, setup. Xoá log rác nếu có.
* **VERIFY:** Chạy được npm install sạch, README dễ đọc và markdown check pass.

---

## ✅ PHASE X: VERIFICATION CHECKLIST
Sau khi hoàn thành các phần trên, phải tiến hành chạy checklist:
- [ ] Chạy Linting: `npm run lint` hoặc `npx eslint .` (Pass)
- [ ] Check build typescript (`tsc --noEmit`).
- [ ] Mở App qua Expo server `npx expo start`, check giao diện demo trên ít nhất 2 resolution screen.
- [ ] Check các cảnh báo log: Giao diện không bị overflow text.
- [ ] Push Notifications Context không ném lỗi trên web simulator/browser (phải check theo rule Platform = iOS/Android).
- [ ] Socratic Gate đã được thông qua.
- [ ] No purple/violet hex codes (Theo Guideline Native).
