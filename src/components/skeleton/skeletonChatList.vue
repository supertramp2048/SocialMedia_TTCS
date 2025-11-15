<template v-if="isLoadingMessages">
    <div class="space-y-10 animate-pulse">
      <div
        v-for="i in 4"
        :key="i"
        class="space-y-8"
      >
        <!-- Tin nhắn phía bên trái (other) -->
        <div class="flex items-start gap-3">
          <!-- avatar -->
          <div class="w-10 h-10 rounded-full bg-gray-300"></div>

          <!-- bubble -->
          <div class="bg-white rounded-2xl shadow-sm px-4 py-3 space-y-2 max-w-xs">
            <!-- name -->
            <div class="h-3 w-24 bg-gray-300 rounded"></div>
            <!-- message line 1 -->
            <div class="h-3 w-32 bg-gray-200 rounded"></div>
            <!-- date -->
            <div class="h-3 w-20 bg-gray-100 rounded mt-1"></div>
          </div>
        </div>

        <!-- Tin nhắn phía bên phải (user) -->
        <div class="flex items-start gap-3 justify-end">
          <!-- bubble -->
          <div class="bg-blue-500 rounded-2xl px-4 py-3 space-y-2 max-w-xs">
            <!-- name -->
            <div class="h-3 w-24 bg-blue-400/80 rounded"></div>
            <!-- message line 1 -->
            <div class="h-3 w-28 bg-blue-300/80 rounded"></div>
            <!-- date -->
            <div class="h-3 w-16 bg-blue-200/80 rounded mt-1"></div>
          </div>

          <!-- avatar -->
          <div class="w-10 h-10 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  </template>