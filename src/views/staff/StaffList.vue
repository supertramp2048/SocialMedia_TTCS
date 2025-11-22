<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Staff Management</h1>
      <router-link
        to="/admin/staff/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create Staff
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600">
        Staff management functionality. This would typically show a list of admin/moderator users
        and allow role changes. For now, use the user management section to view staff members.
      </p>
    </div>
  </div>
</template>

<script setup>
// Staff list view - can be extended with actual staff management
</script>

