import type { Core, InstancePath } from "@/writerTypes";
import Ajv, { ErrorObject } from "ajv";
import { computed, ComputedRef } from "vue";
import { useEvaluator } from "./useEvaluator";

export function useFieldsErrors(
	wf: Core,
	instancePath: ComputedRef<InstancePath>,
) {
	const { getEvaluatedFields } = useEvaluator(wf);

	const component = computed(() => {
		const { componentId } = instancePath.value.at(-1);
		return wf.getComponentById(componentId);
	});

	return computed(() => {
		if (!component.value) return {};

		const fields = wf.getComponentDefinition(component.value.type).fields;
		if (!fields) return {};

		const evaluatedFields = getEvaluatedFields(instancePath.value);

		return Object.entries(fields).reduce((acc, [key, definition]) => {
			let schema = definition.validator;

			if (schema === undefined && definition.options !== undefined) {
				// set an automatic enum schema for options fields
				schema = {
					type: "string",
					enum: Object.keys(definition.options),
				};
			}

			if (schema === undefined) return acc;

			const ajv = new Ajv();
			const validate = ajv.compile(schema);

			const valid = validate(evaluatedFields[key].value);

			if (valid || validate.errors === undefined) return acc;

			acc[key] = formatAjvErrors(validate.errors);

			return acc;
		}, {});
	});
}

function formatAjvError(error: ErrorObject): string {
	let message = "";

	if (error.instancePath) {
		message += `${error.instancePath} `;
	}

	message += error.message;

	if (Array.isArray(error.params?.allowedValues)) {
		message += `: ${error.params.allowedValues}`;
	}

	return message;
}

function formatAjvErrors(errors: ErrorObject[]): string {
	return errors.map(formatAjvError).join("\n");
}
