interface CollectionField {
	field_name: string;
	type: string;
	label: string;
}

interface Collection {
	id: string;
	name: string;
	singular: string;
	plural: string;
	type: "collection" | "single";
	fields: CollectionField[];
	createdAt: string;
	updatedAt: string;
}

export type { Collection, CollectionField };
