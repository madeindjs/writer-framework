import type { SchemaObject } from "ajv";

export function buildValidatorEnum(options: string[]): SchemaObject {
	return {
		type: "string",
		enum: options,
	};
}

export const validatorCssClassname: SchemaObject = {
	type: "string",
	pattern: "(^[a-zA-Z_][a-zA-Z0-9_-]*$)|(^$)",
};

export const validatorCssSize: SchemaObject = {
	type: "string",
	pattern:
		"(^([+-]?\\d*\\.?\\d+)(px|em|%|vh|vw|rem|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr)$)|(^$)",
};

export const validatorEnumYesNo: SchemaObject = buildValidatorEnum([
	"yes",
	"no",
]);

export const validatorArrayOfString: SchemaObject = {
	type: "array",
	items: { type: "string" },
};

export const validatorGpsLat: SchemaObject = {
	type: "number",
	minimum: -90,
	maximum: 90,
};

export const validatorGpsLng: SchemaObject = {
	type: "number",
	minimum: -180,
	maximum: 180,
};

export const validatorGpsMarker: SchemaObject = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		lat: validatorGpsLat,
		lng: validatorGpsLng,
	},
	required: ["lat", "lng", "name"],
	additionalProperties: false,
};

export const validatorGpsMarkers: SchemaObject = {
	type: "array",
	items: validatorGpsMarker,
};

export const validatorObjectRecordNotNested: SchemaObject = {
	type: "object",
	patternProperties: {
		"^.*$": {
			type: ["string", "number", "boolean"],
		},
	},
	additionalProperties: true,
};

export const validatorAnotatedText: SchemaObject = {
	type: "array",
	items: {
		oneOf: [
			{ type: "string" },
			{
				type: "array",
				items: { type: "string" },
			},
		],
	},
};

export const validatorRepeaterObject: SchemaObject = {
	type: "object",
	patternProperties: {
		"^.*$": {
			type: "object",
		},
	},
	additionalProperties: true,
};

export const validatorChatBotMessage: SchemaObject = {
	type: "object",
	properties: {
		role: { type: "string" },
		content: { type: "string" },
	},
	additionalProperties: false,
};

export const validatorChatBotMessages: SchemaObject = {
	type: "array",
	items: validatorChatBotMessage,
};
