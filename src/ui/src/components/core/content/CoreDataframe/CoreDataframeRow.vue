<template>
	<div
		class="CoreDataframeRow"
		tabindex="0"
		@mouseover="isRowHovered = true"
		@mouseleave="isRowHovered = false"
		@focusin="isRowHovered = true"
	>
		<div class="CoreDataframeRow__spacer"></div>
		<div
			v-if="showIndex"
			class="CoreDataframeRow__cell CoreDataframeRow__cell--index"
		>
			{{ indexText }}
		</div>
		<div
			v-for="columnName in columns"
			:key="`${row[ARQUERO_INTERNAL_ID]}_${columnName}`"
			class="CoreDataframeRow__cell"
		>
			<CoreDataframeCell
				:value="row[columnName]"
				:use-markdown="useMarkdown"
				:editable="editable && isRowHovered"
				@change="
					$emit(
						'change',
						columnName,
						row[ARQUERO_INTERNAL_ID],
						$event,
					)
				"
			/>
		</div>
		<div v-if="hasActions" class="CoreDataframeRow__options">
			<div class="CoreDataframeRow__options__wrapper">
				<BaseDropdown
					:options="actions"
					@selected="
						$emit('action', $event, row[ARQUERO_INTERNAL_ID])
					"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import CoreDataframeCell from "./CoreDataframeCell.vue";
import BaseDropdown from "../../base/BaseDropdown.vue";
import { ARQUERO_INTERNAL_ID } from "./constants";

const props = defineProps({
	showIndex: { type: Boolean, required: false },
	indexText: { type: [Number, String], required: true },
	columns: { type: Array as PropType<string[]>, required: true },
	row: { type: Object, required: true },
	useMarkdown: { type: Boolean, required: false },
	editable: { type: Boolean, required: false },
	actions: {
		type: Object as PropType<Record<string, string>>,
		required: true,
	},
});

defineEmits({
	change: (columnName: string, id: number, value: unknown) =>
		typeof columnName === "string" &&
		typeof id === "number" &&
		value !== undefined,
	action: (action: string, index: number) =>
		typeof index === "number" && typeof action === "string",
});

const isRowHovered = ref(false);

const hasActions = computed(() => Object.keys(props.actions || {}).length > 0);
</script>

<style scoped>
.CoreDataframeRow {
	width: fit-content;
	display: grid;
	position: relative;
	font-size: 0.75rem;
	min-height: 40px;
	border-bottom: 1px solid var(--separatorColor);
}
.CoreDataframeRow:hover {
	background-color: var(--wdsColorGray1);
	border-radius: 56px;
}

.CoreDataframeRow__cell {
	padding: 4px;
	min-width: 100px;
	width: 100%;
	display: flex;
	align-items: center;
	border-left: 1px solid var(--separatorColor);
}

.CoreDataframeRow__cell:first-child,
.CoreDataframeRow__cell:nth-child(2) {
	border-left: unset;
}

.CoreDataframeRow__cell--index {
	color: var(--secondaryTextColor);
	min-width: 75px;
	padding: 8.5px 12px 8.5px 12px;
	display: flex;
	align-items: center;
	border-left: unset;
}

.CoreDataframeRow__options {
	position: sticky;
	right: 0px;
	background-color: var(--dataframeBackgroundColor);
	box-shadow: var(--wdsShadowMenu);
	z-index: 3;
	min-width: unset;
}
.CoreDataframeRow__options__wrapper {
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.CoreDataframeRow:hover .CoreDataframeRow__options__wrapper {
	background-color: var(--wdsColorGray1);
	border-top-right-radius: 56px;
	border-bottom-right-radius: 56px;
}
</style>
