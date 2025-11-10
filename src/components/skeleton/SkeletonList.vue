<template>
	<div class="space-y-4">
		<div v-for="n in rows" :key="n" class="flex gap-3">
			<div class="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
			<div class="flex-1 space-y-2">
				<div class="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
				<div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
				<div class="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), {
	rows: 6,
})
</script>

<style scoped>
</style>


