import {
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { toast } from "sonner";

export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
}

interface UseFieldManagementProps {
	/** Initial list of field names */
	initialFields?: string[];
	/** Initial map of field types */
	initialTypes?: Record<string, string>;
	/** The type of collection being managed */
	collectionType?: "collection" | "single";
	/** Callback function triggered when fields or types change */
	onFieldsChange?: (fields: string[], types: Record<string, string>) => void;
}

/**
 * Hook for managing collection fields, including selection, type definition, and reordering.
 * Provides drag-and-drop state management and handlers for adding/removing fields.
 *
 * @param props - Configuration properties for field management
 * @returns Object containing field state and management functions
 */
export const useFieldManagement = ({
	initialFields = [],
	initialTypes = {},
	collectionType = "collection",
	onFieldsChange,
}: UseFieldManagementProps = {}) => {
	const [selectedFields, setSelectedFields] = useState<string[]>(initialFields);
	const [selectedTypes, setSelectedTypes] =
		useState<Record<string, string>>(initialTypes);
	const [fieldBeingAdded, setFieldBeingAdded] = useState<{
		fieldName: string;
		type: string;
		field_name: string;
	} | null>(null);
	const [showFieldNameDialog, setShowFieldNameDialog] = useState(false);
	const [fieldNameError, setFieldNameError] = useState<string>("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Helper to update fields and trigger callback
	const updateState = (
		newFields: string[],
		newTypes: Record<string, string>,
	) => {
		setSelectedFields(newFields);
		setSelectedTypes(newTypes);
		onFieldsChange?.(newFields, newTypes);
	};

	/**
	 * Handles the end of a drag event to reorder fields.
	 *
	 * @param event - The drag end event from dnd-kit
	 */
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = selectedFields.indexOf(active.id as string);
			const newIndex = selectedFields.indexOf(over.id as string);
			const newFields = arrayMove(selectedFields, oldIndex, newIndex);
			updateState(newFields, selectedTypes);
		}
	};

	/**
	 * Manually moves a field from one index to another.
	 *
	 * @param from - The source index
	 * @param to - The destination index
	 */
	const moveSelectedField = (from: number, to: number) => {
		const newFields = arrayMove(selectedFields, from, to);
		updateState(newFields, selectedTypes);
	};

	/**
	 * Updates the type for a specific field.
	 *
	 * @param fieldName - The name of the field to update
	 * @param type - The new type for the field
	 */
	const handleTypeSelect = (fieldName: string, type: string) => {
		const newTypes = { ...selectedTypes, [fieldName]: type };
		setSelectedTypes(newTypes);
		// Note: fields array doesn't change here, but types do.
		// If onFieldsChange expectation is strict about needing both, we pass both.
		// However, usually reorder/add/remove is what we persist for structure.
		// Types update might need persistence too.
		onFieldsChange?.(selectedFields, newTypes);
	};

	/**
	 * Initiates the process of adding a new field by setting up the dialog.
	 *
	 * @param fieldName - The proposed name for the new field (before user input)
	 * @param type - The type of the field to be added
	 */
	const addSelectedFieldRequest = (fieldName: string, type: string) => {
		if (collectionType === "single" && selectedFields.length >= 1) {
			toast.error("Single types can only have one field.");
			return;
		}

		// Just updating types temporarily, not triggering structural change callback yet?

		setSelectedTypes((prev) => ({ ...prev, [fieldName]: type }));
		setFieldBeingAdded({ fieldName, type, field_name: "" });
		setFieldNameError("");
		setShowFieldNameDialog(true);
	};

	/**
	 * Finalizes adding a field to the collection.
	 * specific field name.
	 *
	 * @param type - The type of the field being added
	 * @param field_name - The unique name for the field
	 */
	const addSelectedField = (type: string, field_name: string) => {
		if (selectedFields.includes(field_name)) {
			toast.error("Field name already exists.");
			return;
		}

		if (collectionType === "single" && selectedFields.length >= 1) {
			toast.error("Single types can have only one field.");
			return;
		}

		const newTypes = { ...selectedTypes, [field_name]: type };
		const newFields = [...selectedFields, field_name];

		// Update local state and trigger callback
		setFieldBeingAdded(null);
		setShowFieldNameDialog(false);
		updateState(newFields, newTypes);
	};

	/**
	 * Removes a field from the collection.
	 *
	 * @param field_name - The name of the field to remove
	 */
	const removeSelectedField = (field_name: string) => {
		const newFields = selectedFields.filter((f) => f !== field_name);
		const newTypes = { ...selectedTypes };
		delete newTypes[field_name];

		updateState(newFields, newTypes);
	};

	return {
		selectedFields,
		setSelectedFields,
		selectedTypes,
		setSelectedTypes,
		fieldBeingAdded,
		setFieldBeingAdded,
		showFieldNameDialog,
		setShowFieldNameDialog,
		fieldNameError,
		setFieldNameError,
		sensors,
		handleDragEnd,
		moveSelectedField,
		handleTypeSelect,
		addSelectedFieldRequest,
		addSelectedField,
		removeSelectedField,
	};
};
