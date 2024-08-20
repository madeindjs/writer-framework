<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
	value: { type: Boolean, required: true },
	editable: { type: Boolean, required: false },
});

const emits = defineEmits({
	change: (value: boolean) => typeof value === "boolean",
});

const label = computed(() => (props.value ? "True" : "False"));

function onChange(event: InputEvent) {
	if (!props.editable) {
		// `readonly` props on checkbox has no effect, so we manually prevent when element is disabled
		event.preventDefault();
		event.stopPropagation();
		return;
	}
	emits("change", (event.target as HTMLInputElement).checked);
}
</script>

<template>
	<div
		class="CoreDataframeCellBoolean"
		:class="{ 'CoreDataframeCellBoolean--disabled': !editable }"
	>
		<label>
			<input
				type="checkbox"
				:checked="value"
				:readonly="!editable"
				:tabindex="editable ? 0 : -1"
				@change="onChange"
			/>
			{{ label }}
		</label>
	</div>
</template>

<style scoped>
.CoreDataframeCellBoolean {
	display: flex;
	gap: 8px;
	align-items: center;
}
.CoreDataframeCellBoolean label {
	cursor: pointer;
}
.CoreDataframeCellBoolean--disabled label {
	cursor: not-allowed;
	pointer-events: none;
}
</style>
