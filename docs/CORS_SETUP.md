# CORS Configuration for Admin Panel

## Vấn đề

Admin panel chạy ở port `5174` nhưng backend Laravel chỉ cho phép origin `localhost:5173`, gây ra lỗi CORS.

## Giải pháp

Đã cập nhật 2 file cấu hình trong backend:

### 1. `backend/SocialApp/config/cors.php`

Đã thêm các origins sau vào `allowed_origins`:
- `http://localhost:5173` (front-end client)
- `http://localhost:5174` (admin panel)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`

### 2. `backend/SocialApp/config/sanctum.php`

Đã thêm các domains sau vào `stateful`:
- `localhost:5173`
- `localhost:5174`
- `127.0.0.1:5173`
- `127.0.0.1:5174`

## Sau khi cập nhật

**Bạn cần restart Laravel backend server** để áp dụng thay đổi:

```bash
# Nếu đang chạy bằng php artisan serve
# Dừng server (Ctrl+C) và chạy lại:
php artisan serve

# Hoặc nếu dùng Laravel Sail/Docker, restart container
```

## Kiểm tra

Sau khi restart backend, thử đăng nhập lại trong admin panel. Lỗi CORS sẽ không còn.

## Lưu ý

- Nếu bạn thay đổi port của admin panel, cần cập nhật lại file `cors.php` và `sanctum.php`
- Trong production, nên dùng domain thật thay vì localhost
- Có thể dùng environment variable `FRONTEND_URL` để cấu hình linh hoạt hơn

