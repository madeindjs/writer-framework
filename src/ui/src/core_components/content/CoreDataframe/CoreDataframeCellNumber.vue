<script setup lang="ts">
import { nextTick, ref } from "vue";

const props = defineProps({
	value: { type: Number, required: true },
	useMarkdown: { type: Boolean, required: false },
	editable: { type: Boolean, required: false },
});

const emits = defineEmits({
	change: (value: string) => typeof value === "string",
});

const wrapper = ref<HTMLDivElement | undefined>();
const input = ref<HTMLTextAreaElement | undefined>();
const isEditing = ref(false);

async function startEditing() {
	if (!props.editable) return false;
	isEditing.value = true;
	// focus on the input when it renders
	await nextTick();
	input.value.focus();
}

function stopEditing() {
	isEditing.value = false;
	const newValue = Number(input.value.value);
	if (newValue === props.value) return;
	emits("change", input.value.value);
}
</script>

<template>
	<div
		ref="wrapper"
		class="CoreDataframeCell"
		:class="{ 'CoreDataframeCell--editable': editable }"
		@click="startEditing"
	>
		<input
			v-if="isEditing"
			ref="input"
			type="number"
			:value="value"
			@focusout="stopEditing"
		/>
		<template v-else>
			{{ value }}
		</template>
	</div>
</template>

<style scoped>
.CoreDataframeCell--editable {
	cursor: pointer;
}
.CoreDataframeCell input {
	width: 100%;
	font-size: 0.75rem;

	border: unset;
	resize: vertical;
}
.CoreDataframeCell input:focus {
	border: unset;
	outline: 1px solid var(--primaryTextColor);
}
</style>
