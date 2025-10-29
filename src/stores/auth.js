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
                const res = await api.post('/auth/login', {email,password});
                this.user = res.data.user
                this.token = res.data.token
            } catch (error) {
                alert("Email hoặc mật khẩu sai")
            }
        },
    }
})