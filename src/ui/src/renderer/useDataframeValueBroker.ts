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
	function handleUpdateCell(
		columnName: string,
		rowIndex: string | number,
		value: string,
	) {
		if (!table.value) throw Error("Table is not ready");
		const eventType = "wf-dataframe-update";

		console.log("## derive started", columnName, rowIndex, value);

		// update arquero table

		const updater = escape((d) => {
			// TODO: not sure about using the id
			return d.__index_level_0__ === rowIndex ? value : d[columnName];
		});

		table.value = table.value.derive({ [columnName]: updater });

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
				handleUpdateCell(
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
		handleUpdateCell,
	};
}
