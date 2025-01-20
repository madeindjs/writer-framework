<script setup lang="ts">
import { bigIntReplacer } from "@/core/serializer";
import { computed } from "vue";

const props = defineProps({
	value: { validator: () => true, required: true },
});

const text = computed(() => JSON.stringify(props.value, bigIntReplacer));
</script>

<template>
	<div class="CoreDataframeCellUnknown">
		{{ text }}
	</div>
</template>

<style scoped>
.CoreDataframeCellUnknown {
	width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: inline-block;

	border: 1px solid transparent;
	padding: 8.5px 12px 8.5px 12px;
	pointer-events: none;
}
</style>
