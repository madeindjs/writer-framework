<script setup lang="ts">
import WdsTextInput from "@/wds/WdsTextInput.vue";
import { ref } from "vue";

const props = defineProps({
	value: {
		validator: (v) => typeof v === "number" || typeof v === "bigint",
		required: true,
	},
	editable: { type: Boolean, required: false },
});

const emits = defineEmits({
	change: (value: string) => typeof value === "string",
});

const input = ref<HTMLTextAreaElement | undefined>();

function onChange() {
	const newValue = Number(input.value.value);
	if (newValue === props.value) return;
	emits("change", input.value.value);
}
</script>

<template>
	<!-- TODO: introduce `<WdsNumberInput />`-->
	<WdsTextInput
		v-if="editable"
		ref="input"
		class="CoreDataframeCellNumber--input"
		type="number"
		:model-value="String(value)"
		@focusout="onChange"
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
