# Troubleshooting Guide

## Không thể truy cập localhost:5174

### 1. Kiểm tra Dev Server có đang chạy không

```bash
cd adminSocialMedia
npm run dev
```

Bạn sẽ thấy output tương tự:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: http://192.168.x.x:5174/
```

### 2. Kiểm tra Port có bị chiếm không

**Windows:**
```powershell
netstat -ano | findstr :5174
```

**Linux/Mac:**
```bash
lsof -i :5174
```

Nếu port bị chiếm, bạn có thể:
- Đóng process đang dùng port đó
- Hoặc Vite sẽ tự động chuyển sang port khác (5175, 5176, ...)

### 3. Kiểm tra Firewall/Antivirus

Firewall hoặc Antivirus có thể chặn kết nối. Hãy:
- Tạm thời tắt firewall để test
- Thêm exception cho Node.js và port 5174

### 4. Thử truy cập bằng IP thay vì localhost

Nếu `localhost` không hoạt động, thử dùng:
- `http://127.0.0.1:5174`
- Hoặc IP mạng của bạn (hiển thị trong output của `npm run dev`)

### 5. Kiểm tra Console Logs

Mở Developer Tools (F12) và xem Console tab để tìm lỗi.

### 6. Clear Cache và Reinstall

```bash
# Xóa node_modules và cache
rm -rf node_modules
rm -rf .vite
npm cache clean --force

# Reinstall
npm install

# Chạy lại
npm run dev
```

### 7. Kiểm tra File .env

Đảm bảo file `.env` tồn tại và có cấu hình đúng:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 8. Kiểm tra Node.js Version

Đảm bảo bạn đang dùng Node.js version đúng:
```bash
node --version
# Phải là ^20.19.0 hoặc >=22.12.0
```

### 9. Thử Port Khác

Nếu vẫn không được, thử đổi port trong `vite.config.js`:
```js
server: {
  port: 3000, // hoặc port khác
  host: true
}
```

### 10. Kiểm tra Browser

Thử:
- Browser khác (Chrome, Firefox, Edge)
- Incognito/Private mode
- Clear browser cache

## Lỗi thường gặp khác

### "Cannot find module"
```bash
npm install
```

### "Port already in use"
Vite sẽ tự động chuyển sang port khác. Kiểm tra output của `npm run dev` để xem port mới.

### "Failed to resolve import"
Kiểm tra đường dẫn import có đúng không, đặc biệt là các alias `@/`

### "CORS error"
Đảm bảo backend Laravel đã cấu hình CORS đúng trong `config/cors.php`

