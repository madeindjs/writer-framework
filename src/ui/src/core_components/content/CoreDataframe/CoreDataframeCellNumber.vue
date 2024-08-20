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
const textarea = ref<HTMLTextAreaElement | undefined>();
const isEditing = ref(false);
const height = ref<number | undefined>();

async function startEditing() {
	if (!props.editable) return false;
	height.value = wrapper.value?.getBoundingClientRect().height - 16 - 1;
	isEditing.value = true;
	// focus on the textarea when it renders
	await nextTick();
	textarea.value.focus();
}

function stopEditing() {
	isEditing.value = false;
	const newValue = Number(textarea.value.value);
	if (newValue === props.value) return;
	emits("change", textarea.value.value);
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
			ref="textarea"
			type="number"
			:value="value"
			:style="{
				height: height ? `${height}px` : 'auto',
			}"
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
