<script setup lang="ts">
import WdsNumberInput from "@/wds/WdsNumberInput.vue";
import { ref } from "vue";

const props = defineProps({
	value: {
		validator: (v) => typeof v === "number" || typeof v === "bigint",
		required: true,
	},
	editable: { type: Boolean, required: false },
});

const emits = defineEmits({
	change: (value: number) => typeof value === "number",
});

const input = ref<HTMLTextAreaElement | undefined>();

function onChange(newValue: number) {
	if (newValue === props.value) return;
	console.log(newValue);
	emits("change", newValue);
}
</script>

<template>
	<WdsNumberInput
		v-if="editable"
		ref="input"
		class="CoreDataframeCellNumber--input"
		:model-value="Number(value)"
		@update:model-value="onChange($event)"
	/>
	<div v-else class="CoreDataframeCellNumber--text">
		{{ value }}
	</div>
</template>

<style scoped>
.CoreDataframeCellNumber--input,
.CoreDataframeCellNumber--text {
	width: 100%;
	font-size: 0.75rem;
}

.CoreDataframeCellNumber--input {
	resize: vertical;
	background-color: var(--wdsColorWhite);
	height: 100%;
}
.CoreDataframeCellNumber--input:focus {
	border: unset;
	outline: 1px solid var(--accentColor);
}

.CoreDataframeCellNumber--text {
	border: 1px solid transparent;
	padding: 8.5px 12px 8.5px 12px;
}
</style>
