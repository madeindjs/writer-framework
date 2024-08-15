<script setup lang="ts">
import { computed, PropType, ref, watch } from "vue";
import type * as aq from "arquero";

const props = defineProps({
	table: {
		type: Object as PropType<aq.internal.ColumnTable>,
		required: true,
	},
	displayIndex: {
		type: Boolean,
		required: false,
	},
	wrapText: {
		type: Boolean,
		required: false,
	},
	maxRowsCount: {
		type: Number,
		default: 1000,
	},
});

/**
 * If the table is massive, only a certain amount of rows is rendered at a time,
 * to prevent filling the DOM with unnecessary rows.
 */
const MASSIVE_ROW_COUNT = 1000;
const isRowCountMassive = computed(() => rowCount.value > MASSIVE_ROW_COUNT);

const columnNames = computed(() => props.table.columnNames());
const rowCount = computed(() => props.table.numRows());

const relativePosition = ref();

const rowOffset = computed(() => {
	let maxOffset: number;
	if (props.wrapText) {
		maxOffset = rowCount.value - 1;
	} else {
		maxOffset = rowCount.value - props.maxRowsCount;
	}
	const newOffset = Math.min(
		Math.ceil(relativePosition.value * maxOffset),
		maxOffset,
	);
	return newOffset;
});

const slicedTable = computed(() => {
	const offset = isRowCountMassive.value ? rowOffset.value : 0;
	const limit = props.maxRowsCount;
	const data = props.table.objects({
		offset,
		limit,
	});
	const indices = props.table
		.indices()
		.slice(rowOffset.value, rowOffset.value + limit);
	return {
		data,
		indices,
	};
});

watch(slicedTable, () => console.log("##data", slicedTable.value), {
	immediate: true,
});
</script>

<template>
	<table class="TableEditor">
		<thead>
			<tr>
				<th v-if="displayIndex"></th>
				<th v-for="(column, index) of columnNames" :key="index">
					{{ column }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, rowIndex) of slicedTable.data" :key="rowIndex">
				<th v-if="displayIndex"></th>
				<td v-for="(column, colIndex) of columnNames" :key="colIndex">
					{{ row[column] }}
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style lang="css" scoped>
.TableEditor {
	width: 100%;
}
</style>
