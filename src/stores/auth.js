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
            localStorage.clear()
        },
        async fetchUser(){
            try {
                const res = await api.get('/api/user')
                //this.user = res.data.user
                localStorage.setItem('userId', res.data.id)
                localStorage.setItem('userName', res.data.name)
                localStorage.setItem('userEmail', res.data.email)
                localStorage.setItem('userAvatar', res.data.avatar)
                localStorage.setItem('userCoverPhotoUrl', res.data.cover_photo_url)
                localStorage.setItem('userCreatedAt', res.data.created_at)
                localStorage.setItem('userUpdatedAt', res.data.updated_at)
                this.user = res.data
            } catch (error) {
                console.log(error);
                
            }
        }
    }
})