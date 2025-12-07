import { defineStore } from "pinia";
import api from "../../API/axios"
import {resetAllStores } from '../helper/resetStore'
import Cookies from "js-cookie";
export const useAuthStore = defineStore('auth', {
    state:() => ({
        loading: false,
        user: null,
        token: Cookies.get('token') || null
    }),
    actions:{

        async resetUserInLocal() {
            const res2 = await api.get('/api/user')
            const user2 = res2.data
            // console.log("user2 ",user2);  
            localStorage.setItem('user', JSON.stringify(user2))
            this.user = user2
        },
        async login(email, password){
            try {
                const res = await api.post('/api/login', {email,password});
                const {token, user } = res.data
                Cookies.set('token', res.data.token,{
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),            // thời hạn 7 ngày
                    secure: false,          // true nếu chạy HTTPS
                    sameSite: 'lax'         // tránh lỗi CORS
                })
                const res2 = await api.get('/api/user')
                const user2 = res2.data
                // console.log("user2 ",user2);
                
                localStorage.setItem('user', JSON.stringify(user2))
                this.user = user2
            } catch (error) {

            }
        },
        async logout(){
            try {
                const res = await api.post('/api/logout')
            } catch (error) {
                console.log(error.message)
            }
            finally {
                this.user = null,
                this.token = null,
                resetAllStores()
                Cookies.remove('token')
                localStorage.removeItem('user')
            }
            
        },
        async deleteAcc(userPassword) {
            this.loading = true
            let res = null

            try {
                res = await api.delete('/api/profile/delete', {
                data: { password: userPassword } // body gửi lên server
                })

                if (res.status === 200) {
                await this.logout() // giả sử this.logout là action trong store hiện tại
                }

                return res
            } catch (error) {
                console.log(error)
                // nếu muốn show lỗi ra UI:
                // this.error = error.response?.data?.message || 'Có lỗi xảy ra'
                //throw error // tuỳ anh có muốn throw ra ngoài hay không
            } finally {
                this.loading = false
            }
        },

        resetAuth(){
            this.user = null,
            this.token = null,
            resetAllStores()
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
        async verifyUserEmail(){
            try {
                this.loading = true
                const res = await api.post('/api/email/verification-notification')
                return res
            } catch (error) {
                console.log(error);
                return error
            }
            finally{
                this.loading = false
            }
        }
    }
})
