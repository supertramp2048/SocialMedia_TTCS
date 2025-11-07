<template>
  <Layout>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="grid grid-cols-12 gap-8">
        <!-- Sidebar -->
        <aside class="col-span-12 md:col-span-3">
          <nav class="space-y-2 text-sm">
            <button 
            @click="active = 'account'"
            class="block w-full text-left text-slate-500 hover:text-slate-700" >
            Tài khoản
            </button>
            <button 
            @click="active = 'changePassword'"
            class="block w-full text-left text-slate-500 hover:text-slate-700">
            Đổi mật khẩu
            </button>
          </nav>
        </aside>

        <!-- Main -->
        <ChangeImgPage v-if="active == 'account'"></ChangeImgPage>
      </div>
    </div>
  </Layout>
</template>



<script setup lang="js">
  import Layout from '../../client/layout/layout.vue'
  import ChangeImgPage from "../userSetting/changeImgPage.vue"
  import {ref} from "vue"
  const active = ref('account')
</script>

