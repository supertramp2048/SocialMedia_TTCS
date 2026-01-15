<script setup lang="js">
import { ref, onMounted } from 'vue';
import api from '../../../../API/axios';
import Layout from '../layout/layout.vue';

const apiUrl = import.meta.env.VITE_API_BASE;
const posts = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await api.get(`${apiUrl}/api/posts`, {
      params: {
        page: page.value,
        limit: limit.value,
      },
    });
    posts.value = res.data.data;
    total.value = res.data.total;
  } catch (err) {
    posts.value = [];
    total.value = 0;
  }
  loading.value = false;
};

onMounted(fetchPosts);

const changePage = (p) => {
  page.value = p;
  fetchPosts();
};
</script>

<template>
  <Layout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Tất cả bài viết</h1>
      <div v-if="loading" class="text-center py-10">Đang tải...</div>
      <div v-else>
        <div v-if="posts.length === 0" class="text-center text-gray-500 py-8">Không có bài viết nào.</div>
        <div v-else class="space-y-6">
          <div v-for="post in posts" :key="post.id" class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <h2 class="font-semibold text-xl mb-2">{{ post.title }}</h2>
            <div class="text-gray-500 mb-1 text-sm">{{ post.author?.name || 'Ẩn danh' }} &bull; {{ post.createdAt }}</div>
            <div class="text-gray-700">{{ post.excerpt || post.content?.slice(0, 120) + '...' }}</div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="flex justify-center gap-2 mt-8">
          <button v-for="p in Math.ceil(total / limit)" :key="p" :class="['px-3 py-1 rounded', p === page ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700']" @click="changePage(p)">
            {{ p }}
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>







