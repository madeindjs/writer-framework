import type { Core, InstancePath } from "@/writerTypes";
import Ajv, { ErrorObject } from "ajv";
import { computed, ComputedRef } from "vue";
import { useEvaluator } from "./useEvaluator";

export function useFieldsErrors(
	wf: Core,
	instancePath: ComputedRef<InstancePath>,
) {
	const { getEvaluatedFields } = useEvaluator(wf);

	const componentFields = computed(() => {
		const { componentId } = instancePath.value.at(-1);
		const component = wf.getComponentById(componentId);
		if (!component) return {};

		return wf.getComponentDefinition(component.type).fields ?? {};
	});

	const evaluatedFields = computed(() =>
		getEvaluatedFields(instancePath.value),
	);

	return computed(() => {
		return Object.entries(componentFields.value).reduce(
			(acc, [key, definition]) => {
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

				const valid = validate(evaluatedFields.value[key].value);

				if (valid || validate.errors === undefined) return acc;

				acc[key] = formatAjvErrors(validate.errors);

				return acc;
			},
			{},
		);
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
