<template>
	<tr
		class="CoreDataframeRow"
		tabindex="0"
		@mouseover="isRowHovered = true"
		@mouseleave="isRowHovered = false"
		@focusin="isRowHovered = true"
	>
		<td
			v-if="showIndex"
			class="CoreDataframeRow__cell CoreDataframeRow__cell--index"
		>
			{{ indexText }}
		</td>
		<td
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
		</td>
		<td
			v-if="hasActions"
			class="CoreDataframeRow__cell CoreDataframeRow__cell--hand"
		>
			<BaseDropdown
				:options="actions"
				@selected="$emit('action', $event, row[ARQUERO_INTERNAL_ID])"
			/>
		</td>
	</tr>
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
	position: relative;
	font-size: 0.75rem;
	min-height: 40px;
}
.CoreDataframeRow:hover {
	background-color: var(--wdsColorGray1);
	border-radius: 56px;
}

.CoreDataframeRow__cell {
	padding: 4px;
	min-width: 100px;
	width: 100%;
	border: 1px solid var(--separatorColor);
	/* background: var(--dataframeBackgroundColor); */
}

.CoreDataframeRow__cell:first-child {
	border-left-color: transparent;
}
.CoreDataframeRow__cell:last-child {
	border-right-color: transparent;
}

.CoreDataframeRow__cell--hand {
	position: sticky;
	right: 0px;
	background-color: var(--dataframeBackgroundColor);
	width: 40px;
	min-width: 40px;
}

.CoreDataframeRow__cell--index {
	color: var(--secondaryTextColor);
	min-width: 75px;
}

.CoreDataframeRow:hover,
.CoreDataframeRow:hover .CoreDataframeRow__cell--hand {
	background-color: var(--wdsColorGray1);
	border-radius: 56px;
}
</style>
