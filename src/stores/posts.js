import { defineStore } from "pinia";
import api from "../../API/axios"
const apiUrl = import.meta.env.VITE_API_BASE;
export const usePostsStore = defineStore('posts', {
    state:() => ({
        newestPostsposts: [],
        mostLikedPost: []
    }),
    actions:{
        async newestPosts(){
            const res = await api.get('http://localhost:3000/posts',{
                params: {
                    sort: "createAt",
                    order: "desc"
                }
        })
        this.newestPosts = res.data
        },

        async mostLikedPost(){
            const res = await api.get('http://localhost:3000/posts',{
                params: {
                    sort: "createAt",
                    order: "desc"
                }
        })
        this.newestPosts = res.data
        }
        }
    })
