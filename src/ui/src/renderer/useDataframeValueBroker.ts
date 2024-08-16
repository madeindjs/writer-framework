import { ComponentPublicInstance, computed, Ref, ref, ShallowRef } from "vue";
import { Core, InstancePath } from "../writerTypes";
import { op, type internal, escape, from } from "arquero";

/**
 *
 * Encapsulates repeatable form value logic, including binding.
 *
 * @param wf
 * @param componentId
 * @returns
 */
export function useDataFrameValueBroker(
	wf: Core,
	instancePath: InstancePath,
	emitterEl: Ref<HTMLElement | ComponentPublicInstance>,
	table: ShallowRef<internal.ColumnTable | null>,
) {
	const isBusy = ref(false);
	const queuedEvent: Ref<{ eventValue: string; emitEventType: string }> =
		ref(null);

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
	function handleUpdate(
		columnName: string,
		rowIndex: string | number,
		value: string,
	) {
		if (!table.value) throw Error("Table is not ready");
		const eventType = "wf-dataframe-update";

		// table.value = table.value.union(
		// 	from([{ __index_level_0__: rowIndex, Label: value }]),
		// );

		//
		// table.value = table.value.derive(deriveObject);
		// table.value = table.value
		// 	.filter((d) => d.id === rowIndex)
		// 	.derive({ age: newAge })
		// 	.concat(table.filter((d) => d.id !== dynamicId));
		//
		// const tableUpdate = escape((row) => {
		// 	console.log("##derive", row);
		// 	return row["__index_level_0__"] === 1 ? value : row[columnName];
		// },);
		//
		// table.value = table.value.derive({
		// 	[columnName]: tableUpdate,
		// });
		//
		//
		const updater = escape((d, i) => {
			if (i === rowIndex) {
				return value;
			}
			return d[columnName];
		});

		table.value = table.value.derive({
			[columnName]: updater,
		});
		// table.value = table.value.derive({
		// 	[columnName]: (d, i) => {
		// 		if (i === rowIndex) {
		// 			return value;
		// 		}
		// 		return d[columnName];
		// 	},
		// });

		// console.log("## derive started", columnName, rowIndex, value);
		// table.value = table.value.params({ columnName, value }).derive({
		// 	[columnName]: (row, $) => {
		// 		console.log("## derive inner", row, $);
		// 		return $.value;
		// 	},
		// });
		// console.log(table.value.toHTML());
		// console.log("## derive finished");
		//
		//
		//
		//
		// table.value = table.value.derive({
		// 	[columnName]: op.recode(
		// 		op.case(
		// 			[op.equal(op.get("id"), dynamicId), newValue],
		// 			op.get(dynamicColumn),
		// 		),
		// 	),
		// });

		const isHandlerSet = component.value.handlers?.[eventType];
		const isBindingSet = component.value.binding?.eventType == eventType;

		// Event is not used
		if (!isHandlerSet && !isBindingSet) return;

		if (isBusy.value) {
			// Queued event is overwritten for debouncing purposes

			queuedEvent.value = {
				eventValue: value,
				emitEventType: eventType,
			};
			return;
		}

		isBusy.value = true;
		const callback = () => {
			isBusy.value = false;
			if (queuedEvent.value) {
				handleUpdate(
					queuedEvent.value.eventValue,
					queuedEvent.value.emitEventType,
				);
				queuedEvent.value = null;
			}
		};

		const event = new CustomEvent(eventType, {
			detail: {
				payload: value,
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
		handleUpdate,
	};
}
