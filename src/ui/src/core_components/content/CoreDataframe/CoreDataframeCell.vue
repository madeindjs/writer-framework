<script setup lang="ts">
import { nextTick, ref } from "vue";
import BaseMarkdown from "../../base/BaseMarkdown.vue";

defineProps({
	value: { type: String, required: true },
	useMarkdown: { type: Boolean, required: false },
	editable: { type: Boolean, required: false },
});

const wrapper = ref<HTMLDivElement | undefined>();
const textarea = ref<HTMLTextAreaElement | undefined>();
const isEditing = ref(false);
const height = ref<number | undefined>();

async function startEditing() {
	height.value = wrapper.value?.getBoundingClientRect().height;
	isEditing.value = true;

	// focus on the textarea when it renders
	await nextTick();
	textarea.value.focus();
}

function stopEditing() {
	isEditing.value = false;
}
</script>

<template>
	<div ref="wrapper" class="CoreDataframeCell" @click="startEditing">
		<textarea
			v-if="isEditing"
			ref="textarea"
			:value="value"
			:style="{
				height: height ? `${height}px` : 'auto',
			}"
			@focusout="stopEditing"
		></textarea>
		<template v-else>
			<BaseMarkdown v-if="useMarkdown" :raw-text="value"> </BaseMarkdown>
			<template v-else>
				{{ value }}
			</template>
		</template>
	</div>
</template>

<style scoped>
.CoreDataframeCell {
}
.CoreDataframeCell textarea {
	width: 100%;
	font-size: 0.75rem;

	border: none;
	resize: vertical;
}
</style>
