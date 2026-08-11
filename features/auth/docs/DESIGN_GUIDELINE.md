# Design System Guideline (NativeWind)

Tài liệu này định nghĩa hệ thống thiết kế (Design System) cốt lõi cho ứng dụng. Tất cả các UI components phải được xây dựng dựa trên các Design Tokens (biến thiết kế) quy định tại đây và được cấu hình trực tiếp vào `tailwind.config.js`.

---

## 1. Hệ thống màu sắc (Color Palette)

Hệ thống màu được chia thành 3 nhóm chính. Hạn chế tối đa việc sử dụng mã màu HEX code cứng (hardcode) trong components.

### 1.1. Brand Colors (Màu thương hiệu)

Dùng cho các thành phần chính thể hiện nhận diện thương hiệu (Header, Primary Button, Active Tab, Text Highlight).

- `primary-50`: `#eff6ff` (Background nhạt cho item được chọn)
- `primary-100`: `#dbeafe`
- `primary-500`: `#3b82f6` **(Màu chủ đạo - Main Brand Color)**
- `primary-600`: `#2563eb` (Màu khi nhấn/Hover của Primary Button)
- `primary-900`: `#1e3a8a` (Chữ trên nền primary nhạt)

### 1.2. Neutral Colors (Màu trung tính)

Dùng cho cấu trúc ứng dụng: nền, viền, divider và văn bản.

- `neutral-50`: `#f8fafc` (Màu nền tổng thể của App - App Background)
- `neutral-100`: `#f1f5f9` (Màu nền của Card, Section)
- `neutral-200`: `#e2e8f0` (Đường viền - Border, Divider)
- `neutral-400`: `#94a3b8` (Chữ phụ - Placeholder, Helper text, Disabled text)
- `neutral-600`: `#475569` (Chữ nội dung thứ cấp - Subtitle, Body text phụ)
- `neutral-800`: `#1e293b` (Chữ nội dung chính - Body text)
- `neutral-900`: `#0f172a` (Chữ tiêu đề - Heading, Label quan trọng)

### 1.3. Semantic Colors (Màu trạng thái)

Dùng để phản hồi thông tin cho người dùng hoặc hiển thị trạng thái của các tiến trình (ví dụ: trạng thái đơn hàng, lịch hẹn).

- **Success (Thành công - Xanh lá):**
    - `success-100`: `#dcfce7` (Background badge hoàn thành)
    - `success-500`: `#22c55e` (Icon check, nút xác nhận, trạng thái "Đã hoàn thành")
- **Warning (Cảnh báo/Chờ - Vàng/Cam):**
    - `warning-100`: `#fef9c3` (Background badge chờ xử lý)
    - `warning-500`: `#eab308` (Trạng thái "Đang chờ", "Đang xử lý", Cảnh báo nhẹ)
- **Danger (Lỗi/Thất bại - Đỏ):**
    - `danger-100`: `#fee2e2` (Background badge hủy/lỗi)
    - `danger-500`: `#ef4444` (Nút "Hủy", trạng thái "Đã hủy", Thông báo lỗi)
- **Info (Thông tin - Xanh dương):**
    - _Tái sử dụng dải màu `primary` hoặc định nghĩa riêng dải màu xanh dương nhạt._

---

## 2. Hệ thống Typography (Kiểu chữ)

Sử dụng scale chuẩn để đảm bảo tính phân cấp thông tin rõ ràng.

### 2.1. Font Size (Kích thước)

- `text-xs` (12px): Badge trạng thái, chú thích nhỏ, helper text cho input.
- `text-sm` (14px): Text phụ, thời gian, mô tả ngắn gọn.
- `text-base` (16px): **(Mặc định)** Body text, nội dung chính, text trong Button.
- `text-lg` (18px): Tiêu đề của Card, Label lớn, Section title.
- `text-xl` (20px): Tiêu đề màn hình con, Modal title.
- `text-2xl` (24px): Tiêu đề màn hình chính (Screen Header).

### 2.2. Font Weight (Độ đậm)

- `font-normal` (400): Nội dung văn bản thông thường.
- `font-medium` (500): Nút bấm (Button), Label của Input, Tab đang active.
- `font-semibold` (600): Tiêu đề (Headings), Giá tiền, Thông tin cần nhấn mạnh mạnh.

---

## 3. Hệ thống Spacing & Sizing (Khoảng cách & Kích thước)

Tuân thủ nghiêm ngặt **8-pt Grid System** (Hệ thống lưới bội số của 8).

- `1` (4px): Khoảng cách cực nhỏ (giữa icon và text).
- `2` (8px): Khoảng cách nhỏ (giữa 2 thẻ tag, các item trong list nhỏ).
- `3` (12px): Padding bên trong các component nhỏ (Input, Button size nhỏ).
- `4` (16px): **(Chuẩn)** Padding tiêu chuẩn của màn hình (Screen Padding), khoảng cách giữa các phần tử chính.
- `5` (20px): Padding cho các thành phần cần sự rộng rãi, thoáng đãng.
- `6` (24px): Margin giữa các khối Section lớn với nhau.
- `8` (32px): Khoảng cách từ Bottom đến các nút Floating, hoặc khoảng trống lớn ở cuối trang.

---

## 4. Border Radius (Bo góc)

Xác định "ngôn ngữ hình thể" của UI. Ở đây sử dụng phong cách hiện đại, bo góc mềm mại.

- `rounded-sm` (4px): Checkbox, Status Badge nhỏ.
- `rounded-md` (8px): Input field, Button tiêu chuẩn, Label.
- `rounded-lg` (12px): Image thumbnail, Banner nhỏ.
- `rounded-xl` (16px): Card chứa nội dung (Card đơn hàng, Card dịch vụ), Modal pop-up.
- `rounded-2xl` (24px): Bottom Sheet.
- `rounded-full` (9999px): Avatar người dùng, Floating Action Button (FAB).

---

## 5. Shadows (Đổ bóng)

NativeWind ánh xạ Shadow của Tailwind sang `elevation` (Android) và `shadow-*` (iOS). Hạn chế dùng quá nhiều shadow để tránh giảm hiệu suất render trên mobile.

- `shadow-sm`: Đổ bóng rất nhẹ, dùng cho Card thông thường để tách biệt khỏi nền `neutral-50`.
- `shadow-md`: Đổ bóng vừa, dùng cho Sticky Header, Floating Navigation, Dropdown.
- `shadow-lg`: Đổ bóng đậm, dùng cho Modal Pop-up, Bottom Sheet (nổi bật hoàn toàn khỏi màn hình).

---

## 6. Cấu hình `tailwind.config.js` (Mẫu tham khảo)

Để áp dụng các quy tắc trên, cập nhật file `tailwind.config.js` của dự án như sau:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#eff6ff",
					100: "#dbeafe",
					500: "#3b82f6",
					600: "#2563eb",
					900: "#1e3a8a",
				},
				neutral: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					400: "#94a3b8",
					600: "#475569",
					800: "#1e293b",
					900: "#0f172a",
				},
				success: {
					100: "#dcfce7",
					500: "#22c55e",
				},
				warning: {
					100: "#fef9c3",
					500: "#eab308",
				},
				danger: {
					100: "#fee2e2",
					500: "#ef4444",
				},
			},
			// Override hoặc thêm các config khác nếu cần thiết
		},
	},
	plugins: [],
};
```
