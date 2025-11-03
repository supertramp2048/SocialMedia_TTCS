<template>
    <div>
        <!-- lua chon sap xep post -->
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-row-reverse justify-between h-12">
              <nav class="hidden md:flex gap-3">
                <!-- 2 mục Sap xep -->
                <button
                  type="button"
                  class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                  @click="updatePagination('newest')"
                  :class="{'bg-sky-300': sortSetting == 'newest'}"
                >
                  Mới nhất
                </button>

                <button
                  type="button"
                  class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                  @click="updatePagination('hot')"
                  :class="{'bg-sky-300': sortSetting == 'hot'}"
                >
                  Thịnh hành
                </button>
              </nav>
            </div>
          </div>
          <!-- // tất cả post có phân trang -->
          <div class="grid-cols-1 gap-6">
              <router-link v-for="article in props.posts.data" :key="article.id" 
                  :to="{ path: '/bai-dang/', query: { id:article.id } }"
                   class="group cursor-pointer flex flex-col sm:flex-row">
                <div class="mb-3 mr-3 rounded-lg sm:w-3/12 overflow-hidden">
                  <img :src="article.thumbnail_url" :alt="article.title" 
                       class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div>
                    <h3 class="font-semibold text-2xl text-gray-900 group-hover:text-sky-600 line-clamp-2 mb-2">
                        {{ article.title }}
                    </h3>
                    <div
                    class="flex items-center gap-3 text-sm text-gray-500"
                    >
                    <img
                            :src="article.author?.avatar || AVATAR_FALLBACK"
                            alt="avatar"
                            class="w-5 h-5 rounded-full object-cover"
                            loading="lazy"
                        />
                    <span>{{ article.author.name }}</span>
                    <span>{{ article.comments_count  }} Bình luận</span>
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" :class="{'text-red-500': article.user_vote == 1}" v-if() fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                        </svg>
                        {{  article?.vote_score > 0 ? article?.vote_score : 0}}
                    </span>
                    </div>
                </div>
                
              </router-link>
            </div>
            <Pagination :page_limit="pageLimit"></Pagination>
    </div>
</template>
<script setup lang='js'>
    import { ref, computed, watch, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import Pagination from '../components/pagination.vue'
    const props = defineProps({
        posts : {type: Object, required: true},
        pageLimit : {type: Number, required: true}
    })
    onMounted(()=>{
        console.log(props.posts);
        
        console.log("ben grid ",props.pageLimit );
        
    })
</script>