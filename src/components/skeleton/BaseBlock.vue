<template>
	<div
		:class="[
			'bg-gray-200 rounded',
			'animate-pulse',
			blockClass,
		]"
		:style="styleVars"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	h?: string | number
	w?: string | number
	class?: string
}>()

const blockClass = computed(() => props.class ?? '')

const styleVars = computed(() => {
	const height = typeof props.h === 'number' ? `${props.h}px` : props.h
	const width = typeof props.w === 'number' ? `${props.w}px` : props.w
	return {
		height,
		width,
	}
})
</script>

<style scoped>
</style>


