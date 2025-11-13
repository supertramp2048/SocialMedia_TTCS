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
                const { token, user } = res.data
                Cookies.set('token', res.data.token,{
                    expires: 7,            // thời hạn 7 ngày
                    secure: false,          // true nếu chạy HTTPS
                    sameSite: 'lax'         // tránh lỗi CORS
                })
                localStorage.setItem('user', JSON.stringify(user))
                this.user = user
            } catch (error) {
                
            }
        },
        async logout(){
            this.user = null,
            this.token = null,
            Cookies.remove('token')
            localStorage.removeItem('user')
        },
        // async fetchUser(){
        //     try {
        //         const res = await api.get('/api/user')
        //         //this.user = res.data.user
        //         localStorage.setItem('userId', res.data.id)
        //         localStorage.setItem('userName', res.data.name)
        //         localStorage.setItem('userEmail', res.data.email)
        //         localStorage.setItem('userAvatar', res.data.avatar)
        //         localStorage.setItem('userCoverPhotoUrl', res.data.cover_photo_url)
        //         localStorage.setItem('userCreatedAt', res.data.created_at)
        //         localStorage.setItem('userUpdatedAt', res.data.updated_at)
        //         this.user = res.data
        //     } catch (error) {
        //         console.log(error);
                
        //     }
        // },
        getUserFromLocal() {
            const raw = localStorage.getItem('user')
            
            if (!raw) {
                this.user = null
                return null
            }
            try {
                this.user = JSON.parse(raw)
                return this.user
            } catch {
                this.user = null
                localStorage.removeItem('user')
                return null
            }
        },

    }
})