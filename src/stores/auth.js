import { defineStore } from "pinia";
import api from "../../API/axios"
import Cookies from "js-cookie";
export const useAuthStore = defineStore('auth', {
    state:() => ({
        user: null,
        token: Cookies.get('token') || null
    }),
    actions:{
        async login(email, password){
            try {
                const res = await api.post('/api/login', {email,password});
                Cookies.set('token', res.data.token,{
                    expires: 7,            // thời hạn 7 ngày
                    secure: false,          // true nếu chạy HTTPS
                    sameSite: 'lax'         // tránh lỗi CORS
                })
                localStorage.setItem('user',JSON.stringify(res.data.user))
                this.user = res.data.user
            } catch (error) {
                alert("Email hoặc mật khẩu sai")
            }
        },
        async logout(){
            this.user = null,
            this.token = null,
            Cookies.remove('token')
            localStorage.removeItem('user')
        },
        async fetchUser(){
            try {
                const res = await api.get('/api/user')
                //this.user = res.data.user
                this.user = res.data
            } catch (error) {
                
            }
        }
    }
})