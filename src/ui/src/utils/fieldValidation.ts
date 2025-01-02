import { WriterComponentDefinitionFieldValidator } from "@/writerTypes";

function buildValidatorEnum(
	choices: string[],
): WriterComponentDefinitionFieldValidator {
	const example = choices.map((c) => `"${c}"`).join(", ");
	return function* (value: unknown) {
		if (!choices.includes(String(value))) {
			yield `The value need to be ${example}`;
		}
	};
}

function buildValidatorRegex(
	rule: RegExp,
): WriterComponentDefinitionFieldValidator {
	return function* (value: unknown) {
		if (!rule.test(String(value))) {
			yield `The value need to match ${rule}`;
		}
	};
}

export const validatorYesNo = buildValidatorEnum(["yes", "no"]);

export const validatorAlignement = buildValidatorEnum([
	"left",
	"center",
	"right",
]);

export const validatorCssClass = buildValidatorRegex(
	/^[a-zA-Z_][a-zA-Z0-9_-]*$/,
);
