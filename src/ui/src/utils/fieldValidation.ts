import type { ErrorObject } from "ajv";

function formatAjvError(error: ErrorObject): string {
	console.log("##formatAjvError", error);
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
export function formatAjvErrors(errors: ErrorObject[]): string {
	return errors.map(formatAjvError).join("\n");
}
