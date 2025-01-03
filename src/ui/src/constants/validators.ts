import { Ajv, type SchemaObject } from "ajv";

/**
 * We use an URL to define the `$id` of the schema. The URL doesn't have to exist, it's only used for caching.
 * @see <https://ajv.js.org/guide/managing-schemas.html#cache-key-schema-vs-key-vs-id>
 */
function generateSchemaId(path: string) {
	return `https://dev.writer.com/framework/${encodeURIComponent(path)}.json`;
}

export function buildJsonSchemaForEnum(options: string[]): SchemaObject {
	return {
		$id: generateSchemaId(options.join(",")),
		type: "string",
		enum: options,
	};
}

export function buildJsonSchemaForNumberBetween(
	minimum: number,
	maximum: number,
): SchemaObject {
	return {
		$id: generateSchemaId(`between-${minimum}-${maximum}`),
		type: "number",
		minimum,
		maximum,
	};
}

export const validatorCssClassname: SchemaObject = {
	$id: generateSchemaId("cssClassname"),
	type: "string",
	pattern: "(^[a-zA-Z_][a-zA-Z0-9_-]*$)|(^$)",
};

export const validatorCssSize: SchemaObject = {
	$id: generateSchemaId("cssSize"),
	type: "string",
	pattern:
		"(^([+-]?\\d*\\.?\\d+)(px|em|%|vh|vw|rem|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr)$)|(^$)",
};

export const validatorEnumYesNo: SchemaObject = buildJsonSchemaForEnum([
	"yes",
	"no",
]);

export const validatorArrayOfString: SchemaObject = {
	$id: generateSchemaId("arrayOfString"),
	type: "array",
	items: { type: "string" },
};

export const validatorGpsLat = buildJsonSchemaForNumberBetween(-90, 90);

export const validatorGpsLng = buildJsonSchemaForNumberBetween(-180, 180);

export const validatorGpsMarker: SchemaObject = {
	$id: generateSchemaId("gpsMarker"),
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
	$id: generateSchemaId("gpsMarkers"),
	type: "array",
	items: validatorGpsMarker,
};

export const validatorObjectRecordNotNested: SchemaObject = {
	$id: generateSchemaId("objectRecordNotNested"),
	type: "object",
	patternProperties: {
		"^.*$": {
			type: ["string", "number", "boolean"],
		},
	},
	additionalProperties: true,
};

export const validatorAnotatedText: SchemaObject = {
	$id: generateSchemaId("anotatedText"),
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
	$id: generateSchemaId("repeaterObject"),
	type: "object",
	patternProperties: {
		"^.*$": {
			type: "object",
		},
	},
	additionalProperties: true,
};

export const validatorChatBotMessage: SchemaObject = {
	$id: generateSchemaId("chatBotMessage"),
	type: "object",
	properties: {
		role: { type: "string" },
		content: { type: "string" },
	},
	additionalProperties: false,
};

export const validatorChatBotMessages: SchemaObject = {
	$id: generateSchemaId("chatBotMessages"),
	type: "array",
	items: validatorChatBotMessage,
};

export const validatorPositiveNumber: SchemaObject = {
	$id: generateSchemaId("positiveNumber"),
	type: "number",
	minimum: 0,
};

export const validatorUri = {
	$id: generateSchemaId("uri"),
	type: "string",
	format: "uri",
};

export const ajv = new Ajv({
	strict: true,
	allowUnionTypes: true,
});

/**
 * Compile and cache schema on demand
 */
export function getJsonSchemaValidator(schema: SchemaObject) {
	if (schema?.$id === undefined) return ajv.compile(schema);
	return ajv.getSchema(schema.$id) || ajv.compile(schema);
}
