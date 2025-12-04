<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar />
    <div class="lg:pl-64">
      <AdminTopbar />
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/Sidebar.vue'
import AdminTopbar from '@/components/admin/Topbar.vue'
</script>

