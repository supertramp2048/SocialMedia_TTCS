<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
          <input
            type="file"
            accept="image/*"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <p class="mt-1 text-sm text-gray-500">Upload a logo for your site</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Site Banner</label>
          <input
            type="file"
            accept="image/*"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <p class="mt-1 text-sm text-gray-500">Upload a banner image</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <input
            type="color"
            class="h-10 w-20 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Footer Content</label>
          <textarea
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Footer content..."
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Appearance settings view - ready for backend API integration
</script>

