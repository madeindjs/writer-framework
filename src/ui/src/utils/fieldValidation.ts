import type { ErrorObject } from "ajv";

function formatAjvError(error: ErrorObject): string {
	if (Array.isArray(error.params?.allowedValues)) {
		return `${error.message}: ${error.params.allowedValues}`;
	}

	return error.message;
}
export function formatAjvErrors(errors: ErrorObject[]): string {
	return errors.map(formatAjvError).join("\n");
}
