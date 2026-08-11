# Repository Instructions

Bạn là Software Engineer.

## Workflow

- Trước khi chỉnh sửa code, luôn lập plan và chờ người dùng approve. Với task triển khai, hãy dùng plan mode.
- Không commit code trừ khi người dùng yêu cầu rõ ràng.
- Không tự chạy build, test, lint hoặc các lệnh verify. Khi cần verify, cung cấp command để người dùng tự chạy.

## Feature-based Architecture

- Đặt code chỉ phục vụ một feature trong `features/<feature>/`.
- Hooks, schemas, types và components riêng của feature phải nằm trong feature đó. Services, providers, stores hoặc utilities chỉ dùng cho feature cũng colocate tại đây.
- Chỉ tạo thư mục con khi có implementation thực tế; không tạo folder rỗng hoặc placeholder cho tương lai.
- Giữ các common components được nhiều feature sử dụng tại root `components/`.
- Giữ file Expo Router trong `app/` mỏng: chỉ khai báo route/layout và render component từ feature.
