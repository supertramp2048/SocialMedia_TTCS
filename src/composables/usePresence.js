// src/composables/usePresence.js
import { reactive } from 'vue';

// State toàn cục (Singleton)
// Dùng Map để truy xuất nhanh O(1) và tự động reactive
const state = reactive({
    users: new Map(),
    isReady: false
});

export function usePresence() {

    // Hàm khởi tạo kết nối (Chỉ gọi 1 lần)
    const initPresence = (echoInstance) => {
        if (!echoInstance) return;
        if (state.isReady) return; // Tránh subscribe nhiều lần

        // 'online' là tên channel đã định nghĩa ở Laravel routes/channels.php
        echoInstance.join('online')
            .here((users) => {
                // users là mảng [] -> chuyển sang Map
                users.forEach((user) => {
                    state.users.set(Number(user.id), user);
                });
                state.isReady = true;
                // console.log('Presence ready:', state.users.size);
            })
            .joining((user) => {
                state.users.set(Number(user.id), user);
            })
            .leaving((user) => {
                state.users.delete(Number(user.id));
            })
            .error((err) => {
                console.error('Presence Error:', err);
            });
    };

    // Hàm check nhanh dùng trong template
    const checkUserOnline = (userId) => {
        // Ép kiểu Number để chắc chắn so sánh đúng
        return state.users.has(Number(userId));
    };

    return {
        onlineUsers: state.users,
        initPresence,
        checkUserOnline
    };
}
