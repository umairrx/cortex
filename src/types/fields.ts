/**
 * Represents a single field type with its configuration and validation rules.
 */
export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
	component: string;
	validation?: {
		required?: boolean;
		minLength?: number;
		maxLength?: number;
		pattern?: string;
	};
}

export interface FieldGroup {
	name: string;
	icon: string;
	types: FieldType[];
}

export const FIELD_TYPES: FieldGroup[] = [
	{
		name: "Text",
		icon: "FileText",
		types: [
			{
				type: "short",
				label: "Short Text",
				maxLength: 100,
				component: "Input",
				validation: { maxLength: 100 },
			},
			{
				type: "long",
				label: "Long Text",
				maxLength: 300,
				component: "Textarea",
				validation: { maxLength: 300 },
			},
		],
	},
	{
		name: "Rich Content",
		icon: "Edit",
		types: [
			{
				type: "richtext",
				label: "Rich Text",
				component: "RichTextEditor",
			},
			{
				type: "richmarkdown",
				label: "Rich Markdown",
				component: "MarkdownEditor",
			},
		],
	},
	{
		name: "Date",
		icon: "Calendar",
		types: [
			{
				type: "date",
				label: "Date",
				component: "DatePicker",
			},
		],
	},
	{
		name: "Image",
		icon: "Image",
		types: [
			{
				type: "single",
				label: "Single Image",
				component: "ImageUpload",
			},
			{
				type: "multiple",
				label: "Multiple Images",
				component: "MultiImageUpload",
			},
		],
	},
];

/**
 * Retrieves a field type definition by its type string.
 * Searches through all field groups to find a matching type.
 *
 * @param type - The field type string to look up
 * @returns The FieldType definition or undefined if not found
 */
export const getFieldType = (type: string): FieldType | undefined => {
	for (const group of FIELD_TYPES) {
		const fieldType = group.types.find((t) => t.type === type);
		if (fieldType) return fieldType;
	}
	return undefined;
};

/**
 * Retrieves a field group by searching for a type within it.
 * Finds the field group that contains the specified field type.
 *
 * @param type - The field type to search for
 * @returns The FieldGroup containing this type or undefined if not found
 */
export const getFieldGroup = (type: string): FieldGroup | undefined => {
	return FIELD_TYPES.find((group) => group.types.some((t) => t.type === type));
};
