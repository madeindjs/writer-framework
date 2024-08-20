import {
	ComponentPublicInstance,
	computed,
	readonly,
	Ref,
	ref,
	ShallowRef,
} from "vue";
import { Core, InstancePath } from "../writerTypes";
import { type internal } from "arquero";
import { ARQUERO_INTERNAL_ID } from "../core_components/content/CoreDataframe/constants";

/**
 *
 * Encapsulates repeatable form value logic, including binding.
 *
 * @param wf
 * @param componentId
 */
export function useDataFrameValueBroker(
	wf: Core,
	instancePath: InstancePath,
	emitterEl: Ref<HTMLElement | ComponentPublicInstance>,
	table: ShallowRef<internal.ColumnTable | null>,
) {
	const isBusy = ref(false);
	const queuedEvent: Ref<{
		columnName: string;
		rowIndex: number;
		value: string;
	}> = ref(null);

	const componentId = instancePath.at(-1).componentId;
	const component = computed(() => wf.getComponentById(componentId));

	/**
	 * Takes a value and emits a CustomEvent of the given type.
	 * Deals with debouncing.
	 *
	 * @param newValue
	 * @param eventType
	 * @returns
	 */
	async function handleUpdateCell(
		columnName: string,
		rowIndex: number,
		value: string,
	) {
		if (!table.value) throw Error("Table is not ready");
		const eventType = "wf-dataframe-update";
		const rowIndexBackend = rowIndex - 1; // 0-based index (arquero is based on 1-based index)

		const aq = await import("arquero");

		const recordFilter = aq.escape(
			(d: Record<string, unknown>) => d[ARQUERO_INTERNAL_ID] === rowIndex,
		);

		// get previous value to format it
		const previousRecord = table.value.filter(recordFilter).object();
		if (!previousRecord) throw Error("Could not find record");
		const previousValue = previousRecord[columnName];

		const valueTyped = formatValue(previousValue, value);

		// update arquero table
		const updater = aq.escape((d: Record<string, unknown>) => {
			return d[ARQUERO_INTERNAL_ID] === rowIndex
				? valueTyped
				: d[columnName];
		});

		table.value = table.value.derive({ [columnName]: updater });

		const record = table.value.filter(recordFilter).object();
		delete record[ARQUERO_INTERNAL_ID];

		const isHandlerSet = component.value.handlers?.[eventType];
		const isBindingSet = component.value.binding?.eventType == eventType;

		// Event is not used
		if (!isHandlerSet && !isBindingSet) return;

		if (isBusy.value) {
			// Queued event is overwritten for debouncing purposes
			queuedEvent.value = { columnName, rowIndex, value };
			return;
		}

		isBusy.value = true;
		const callback = () => {
			isBusy.value = false;
			if (queuedEvent.value) {
				handleUpdateCell(
					queuedEvent.value.columnName,
					queuedEvent.value.rowIndex,
					queuedEvent.value.value,
				);
				queuedEvent.value = null;
			}
		};

		const event = new CustomEvent(eventType, {
			detail: {
				payload: {
					record,
					record_index: rowIndexBackend,
				},
				callback,
			},
		});

		if (emitterEl.value instanceof HTMLElement) {
			emitterEl.value.dispatchEvent(event);
		} else {
			// Vue instance (ComponentPublicInstance)
			emitterEl.value.$el.dispatchEvent(event);
		}
	}

	return {
		handleUpdateCell,
		isBusy: readonly(isBusy),
	};
}

function formatValue(previousValue: unknown, value: string) {
	switch (typeof previousValue) {
		case "number":
			return Number(value);
		case "string":
			return String(value);
		case "boolean":
			return Boolean(value);
		case "bigint":
			return BigInt(value);
		default:
			throw Error(
				`Could not update a field of type ${typeof previousValue}`,
			);
	}
}
