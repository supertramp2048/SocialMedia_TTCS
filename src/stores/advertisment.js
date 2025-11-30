// src/stores/setting.js (ví dụ)
import { defineStore } from 'pinia'
import api from '../../API/axios'

export const useAdsStore = defineStore('ads', {
  state: () => ({
    loading: false,
    loaded: false,
    allAds: null,
    sidebarTopAds: null,
    sidebarLeftAds:null,
    sidebarRightAds:null,
    InfeedAds:null,
  }),

  actions: {
    async getAllAds(){
        if(this.loaded == true) return
        try {
            this.loading = true
            this.sidebarTopAds = await this.getAdsByPosition('sidebar_top')   
            this.InfeedAds = await this.getAdsByPosition('in_feed')   
            this.sidebarLeftAds = await this.getAdsByPosition('left_sidebar')  
            this.sidebarRightAds = await this.getAdsByPosition('right_sidebar') 
            this.allAds = {
            sidebarTopAds: this.sidebarTopAds,
            InfeedAds: this.InfeedAds,
            sidebarLeftAds: this.sidebarLeftAds,
            sidebarRightAds: this.sidebarRightAds
        }
        } catch (error) {
            console.log(error);
        }
        finally{
            this.loading = false
            this.loaded = true
        }
    },
    async getAdsByPosition(position){
        const res = await api.get('/api/advertisements', { params: { position }})
        //console.log(`ads in ${position} :` ,res)  
        return res.data.data
    },
    
  },
})
