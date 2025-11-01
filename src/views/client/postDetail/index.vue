<template>
    <Layout>
        <div class="min-h-screen bg-white">
    <!-- Main Content -->
    <main class="w-full">
      <!-- Top Banner Ad -->
      <div class="flex justify-center py-8 bg-white">
        <div class="w-full max-w-[680px] px-4">
          <img 
            :src="post.data?.thumbnail_url" 
            alt="Banner Ad" 
            class="w-full h-auto rounded"
          />
        </div>
      </div>

      <!-- Article Content Container -->
      <div class="max-w-[700px] mx-auto px-4 pb-16">
        <!-- Category -->
        <router-link class="inline-block text-sm text-text-secondary mb-4">
          {{ post.data?.category?.name  }}
        </router-link>

        <!-- Article Title -->
        <h1 class="text-[42px] leading-[58px] font-bold font-montserrat text-[#2D3748] mb-6">
           {{ post.data?.title  }}
        </h1>

        <!-- Author Info -->
        <div class="flex items-center gap-3 mb-8">
          <img 
            :src="post.data?.author?.avartar"
            alt="Author" 
            class="w-14 h-14 rounded-full"
          />
          <div>
            <a href="#" class="font-bold text-sm text-text-primary block">{{post.data?.author.name}}</a>
            <span class="text-[13px] text-text-muted">{{ new Date(post.data?.updated_at || created_at).toLocaleDateString('vi-VN') }}</span>
          </div>
          <button class="ml-auto">
            <svg class="w-4 h-4" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.895431 0 2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4Z" fill="#111827"/>
              <path d="M2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10Z" fill="#111827"/>
              <path d="M2 16C0.89543 16 0 15.1046 0 14C0 12.8954 0.895431 12 2 12C3.10457 12 4 12.8954 4 14C4 15.1046 3.10457 16 2 16Z" fill="#111827"/>
            </svg>
          </button>
        </div>

        <!-- Article Body -->
        <article class="prose prose-lg max-w-none" v-html="post.data?.content_html">
        </article>
        <!-- Tags -->
        <div class="flex gap-3 mt-8 mb-6">
          <a href="#" class="px-2.5 py-2 rounded bg-black bg-opacity-5 text-xs uppercase text-text-primary">
            Góc_nhìn_thời_sự
          </a>
          <a href="#" class="px-2.5 py-2 rounded bg-black bg-opacity-5 text-xs uppercase text-text-primary">
            Thinking_Out_Loud
          </a>
        </div>

        <!-- Newsletter Signup -->
        <div class="w-full h-[200px] bg-[#002E75] rounded mb-8 flex items-center justify-center p-4">
          <div class="max-w-[400px] w-full">
            <input 
              type="email" 
              placeholder="Your Email" 
              class="w-full px-4 py-2.5 rounded border border-[#EAE9E9] mb-5 text-sm"
            />
            <button class="w-full px-4 py-3 rounded bg-[#078CC0] text-white text-sm font-normal">
              ĐĂNG KÝ!
            </button>
          </div>
        </div>

        <!-- Engagement Stats -->
        <div class="flex items-center gap-4 py-6 border-b border-border-lighter mb-6">
          <div class="flex items-center gap-2">
            <svg class="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.80974 5.27744L3.18474 14.294H14.4761L8.80974 5.27744ZM8.80974 1.92725L17.6609 16.0725H0L8.80974 1.92725Z" fill="#969696"/>
            </svg>
            <span class="font-semibold text-base">20</span>
          </div>
          <svg class="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.19027 12.7223L14.8153 3.70574H3.5239L9.19027 12.7223ZM9.19027 16.0725L0.339157 1.92725L18 1.92725L9.19027 16.0725Z" fill="#969696"/>
          </svg>
          <span class="text-text-muted">·</span>
          <span class="text-base text-text-primary"> {{ post.data?.comments_count }} bình luận</span>
        </div>

        <!-- Author Follow Section -->
        <div class="flex items-center gap-4 mb-8">
          <img 
            :src="post.data?.author?.avater" 
            alt="Author" 
            class="w-12 h-12 rounded-full"
          />
          <div class="flex-1">
            <a href="#" class="font-bold text-sm text-text-primary block">{{post.data?.author?.name}}</a>
          </div>
          <button class="px-4 py-2.5 rounded border border-[#E3E3E3] text-sm text-text-primary">
            Follow
          </button>
        </div>
      </div>

      <!-- Related Articles Section -->
      <div class="max-w-[875px] mx-auto px-4 mb-16">
        <h2 class="font-bold text-sm text-text-primary mb-4">Bài viết nổi bật khác</h2>
        <div class="border border-border-lighter rounded overflow-x-auto">
          <div class="flex gap-6 p-8 min-w-max">
            <!-- Article Card 1 -->
            <div class="w-64 flex-shrink-0">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/f2766e713f9d4028f5edf8c05c7632476cf51dc5?width=512" 
                alt="Related Article" 
                class="w-full h-40 object-cover rounded mb-4"
              />
              <p class="text-xs uppercase text-text-primary mb-2">Quan điểm - Tranh luận</p>
              <h3 class="text-base font-bold font-montserrat text-text-primary leading-6 mb-2">
                Sex thì tốt đấy, nhưng thiếu hiểu biết về Sex và mắc các
              </h3>
              <p class="text-xs font-semibold text-text-primary">yesimquynh</p>
            </div>

            <!-- Article Card 2 -->
            <div class="w-64 flex-shrink-0">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/e0bbde7c13870a482d92c5581df528dc83254386?width=512" 
                alt="Related Article" 
                class="w-full h-40 object-cover rounded mb-4"
              />
              <p class="text-xs uppercase text-text-primary mb-2">Quan điểm - Tranh luận</p>
              <h3 class="text-base font-bold font-montserrat text-text-primary leading-6 mb-2">
                Mua Xe Sang Ở Việt Nam Mắc Gấp 3 Lần Ở Châu Âu, Người
              </h3>
              <p class="text-xs font-semibold text-text-primary">The Mighty Piggy</p>
            </div>

            <!-- Article Card 3 -->
            <div class="w-64 flex-shrink-0">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/80f4644342e210042292a49e9f806cdc6ba0af7b?width=512" 
                alt="Related Article" 
                class="w-full h-40 object-cover rounded mb-4"
              />
              <p class="text-xs uppercase text-text-primary mb-2">Quan điểm - Tranh luận</p>
              <h3 class="text-base font-bold font-montserrat text-text-primary leading-6 mb-2">
                Sự tương quan giữa trao đổi thị trường và trao đổi xã hội
              </h3>
              <p class="text-xs font-semibold text-text-primary">APPLEPIE</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="max-w-[768px] mx-auto px-4 mb-16">
        <div class="border border-border-lighter rounded shadow-card p-6">
          <!-- Comment Form -->
          <div class="border-b border-border-lighter pb-6 mb-6">
            <input 
              type="text" 
              placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết" 
              class="w-full text-sm text-[#CBD5E0] focus:outline-none"
            />
            <div class="flex justify-end mt-4">
              <button class="text-sm text-text-primary px-2 py-1 rounded">Gửi</button>
            </div>
          </div>

          <!-- Comment Sorting -->
          <div class="flex gap-3 mb-6 justify-end">
            <button class="text-sm text-primary">Hot nhất</button>
            <button class="text-sm text-text-primary">Mới nhất</button>
          </div>

          <!-- Sample Comment -->
          <div v-for="comment in post.data?.comments" :key=comment.id class="flex gap-3 mb-6">
            <img 
              :src="comment?.author.avartar" 
              alt="Commenter" 
              class="w-12 h-12 rounded-full border border-border-light"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <a href="#" class="font-bold text-sm text-text-primary">{{comment?.author?.name}}</a>
                <span class="text-[13px] text-text-secondary text-opacity-75">{{ new Date(comment?.updated_at || created_at).toLocaleDateString('vi-VN') }}</span>
              </div>
              <p class="text-sm text-text-primary leading-relaxed mb-4">
                {{comment?.content}}
              </p>
              <div class="flex items-center gap-3 text-text-secondary text-opacity-75">
                <button class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300">Trả lời</button>
              </div>
              <div>
                <button v-if="comment?.replies_count > 0" class="text-[15px] font-bold text-blue-500">{{comment?.replies_count}} Trả lời</button>
              </div>
            </div>
          </div>
          <!-- end saple comment -->

        </div>
      </div>
    </main>
  </div>
    </Layout>
</template>
<script setup lang='js'>
import Layout from '../layout/layout.vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from "../../../../API/axios"
import { usePostDetailStore } from '../../../stores/postDetail'
// loader cho trang
import { globalLoading } from '../../../../API/axios'
import loader from '../../../components/loader.vue'

const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
const loading = ref(false)
const postDetail = usePostDetailStore()
const post = ref({})
onMounted( async ()=>{
    const postId = Number(route.query.id)
    const res = await api.get(`${apiUrl}/api/posts/${postId}`)
    post.value = res.data
    console.log(post.value);
    
})
</script>