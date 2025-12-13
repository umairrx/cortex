import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AxiosError } from "axios";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CollectionDialogs } from "@/components/CollectionDialogs";
import { CollectionForm } from "@/components/CollectionForm";
import { FieldManagement } from "@/components/FieldManagement";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollections } from "@/contexts/CollectionsContext";
import CollectionTypesHeader from "@/pages/CollectionTypesHeader";
import { FIELD_TYPES } from "@/types/fields";
import type { CollectionField } from "@/types/types";
import type { CollectionNameValidationResult } from "@/utils/collectionNameValidator";

export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
}

export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
}

export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
}

/**
 * Page component for creating new collection types and managing their fields.
 * Allows users to define a collection name, type (collection or single),
 * and add multiple fields with drag-and-drop reordering support.
 *
 * @returns The create collection page with field selection and management
 */
const CreateCollection = () => {
	const { addCollection } = useCollections();
	const navigate = useNavigate();
	const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
		{},
	);
	const [selectedFields, setSelectedFields] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const [collectionNameInput, setCollectionNameInput] = useState<string>("");
	const [collectionNameValidation, setCollectionNameValidation] =
		useState<CollectionNameValidationResult | null>(null);
	const [customPlural, setCustomPlural] = useState<string>("");
	const [collectionType, setCollectionType] = useState<"collection" | "single">(
		"collection",
	);
	const [showCreateCollectionDialog, setShowCreateCollectionDialog] =
		useState(false);
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const [collectionDraftName, setCollectionDraftName] = useState<string>("");
	const [prevCollectionName, setPrevCollectionName] = useState<string>("");
	const [isCollectionCreated, setIsCollectionCreated] = useState(false);

	const [fieldBeingAdded, setFieldBeingAdded] = useState<{
		fieldName: string;
		type: string;
		field_name: string;
	} | null>(null);
	const [showFieldNameDialog, setShowFieldNameDialog] = useState(false);
	const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
	const [fieldNameError, setFieldNameError] = useState<string>("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	/**
	 * Saves the collection to the context and navigates to the collection edit page.
	 * Uses the validated and normalized collection name to generate singular and plural forms.
	 */
	const saveCollection = async () => {
		if (!collectionNameValidation || !collectionNameValidation.isValid) {
			return;
		}

		const fields: CollectionField[] = selectedFields.map((field_name) => ({
			field_name,
			type: selectedTypes[field_name],
			label: getMainFieldName(selectedTypes[field_name]),
		}));

		const collectionData = {
			id: collectionNameValidation.singular,
			name: collectionNameValidation.displayName,
			singular: collectionNameValidation.singular,
			plural: customPlural || collectionNameValidation.plural,
			type: collectionType,
			fields,
		};

		try {
			const createdCollection = await addCollection(collectionData);
			navigate(`/collection-types-builder/${createdCollection.id}`);
			toast.success("Collection saved successfully.");
		} catch (error: unknown) {
			console.error("Failed to save collection:", error);
			const axiosError = error as AxiosError;
			if (axiosError.response?.status === 403) {
				toast.error("You do not have permission to perform this action.");
			} else {
				toast.error("Failed to save collection. Please try again.");
			}
		}
	};

	/**
	 * Handles reordering of fields when they are dragged and dropped.
	 * Updates the field order in the state.
	 *
	 * @param event - The drag end event containing the active and over field IDs
	 */
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setSelectedFields((items) => {
				const oldIndex = items.indexOf(active.id as string);
				const newIndex = items.indexOf(over.id as string);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const moveSelectedField = (from: number, to: number) => {
		setSelectedFields((items) => arrayMove(items, from, to));
	};

	/**
	 * Retrieves the main field name for a given field type.
	 * Searches through available field types to find the matching category name.
	 *
	 * @param type - The field type to look up
	 * @returns The main field name or the type itself if not found
	 */
	const getMainFieldName = (type: string) => {
		for (const field of collectionFields) {
			if (field.types.some((t) => t.type === type)) {
				return field.name;
			}
		}
		return type;
	};

	const collectionFields = FIELD_TYPES;

	/**
	 * Updates the selected type for a field without opening the field name dialog.
	 * Used for single-type fields that don't require user-defined names.
	 *
	 * @param fieldName - The name of the field
	 * @param type - The type to select for the field
	 */
	const handleTypeSelect = (fieldName: string, type: string) => {
		setSelectedTypes((prev) => ({ ...prev, [fieldName]: type }));
	};

	/**
	 * Initiates the request to add a field by opening the field name dialog.
	 * Allows the user to specify a custom name for the field before adding it.
	 *
	 * @param fieldName - The field type name
	 * @param type - The specific type variant
	 */
	const addSelectedFieldRequest = (fieldName: string, type: string) => {
		// Prevent adding more than 1 field on single collection type
		if (collectionType === "single" && selectedFields.length >= 1) {
			toast.error("Single types can only have one field.");
			return;
		}

		setSelectedTypes((prev) => ({ ...prev, [fieldName]: type }));

		setFieldBeingAdded({ fieldName, type, field_name: "" });
		setFieldNameError("");
		setShowFieldNameDialog(true);
	};

	/**
	 * Adds a field to the selected fields list if it doesn't already exist.
	 * Updates both the field type mapping and the field list.
	 *
	 * @param type - The field type
	 * @param field_name - The custom name assigned to the field
	 */
	const addSelectedField = (type: string, field_name: string) => {
		if (selectedFields.includes(field_name)) {
			return;
		}

		if (collectionType === "single" && selectedFields.length >= 1) {
			toast.error("Single types can have only one field.");
			return;
		}
		setSelectedTypes((prev) => ({ ...prev, [field_name]: type }));
		setSelectedFields((prev) => [...prev, field_name]);
		setFieldBeingAdded(null);
		setShowFieldNameDialog(false);
	};

	/**
	 * Removes a field from the selected fields list and its type mapping.
	 *
	 * @param field_name - The name of the field to remove
	 */
	const removeSelectedField = (field_name: string) => {
		setSelectedFields((prev) => prev.filter((f) => f !== field_name));
		setSelectedTypes((prev) => {
			const copy = { ...prev };
			delete copy[field_name];
			return copy;
		});
	};

	/**
	 * Renders a draggable field item in the sortable list.
	 * Displays the field name, type, and provides a remove button.
	 * Can be reordered via drag and drop.
	 *
	 * @param field_name - The name of the field
	 * @param field_type - The type of the field
	 * @param removeSelectedField - Callback to remove the field
	 * @returns A draggable field item component
	 */
	const SortableItem = ({
		field_name,
		field_type,
		removeSelectedField,
	}: {
		field_name: string;
		field_type: string;
		removeSelectedField: (field_name: string) => void;
	}) => {
		const { attributes, listeners, setNodeRef, transform, transition } =
			useSortable({
				id: field_name,
			});

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
		};

		return (
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				className="flex items-center justify-between p-3 border rounded"
			>
				<div className="flex items-center gap-2">
					<button
						type="button"
						{...listeners}
						{...attributes}
						aria-label="Drag field"
						className="cursor-move touch-none p-1 bg-transparent"
						style={{ touchAction: "none" }}
					>
						<GripVertical className="h-5 w-5 text-primary" />
					</button>
					<div>
						<div className="text-sm font-medium">{field_name}</div>
						<div className="text-xs text-muted-foreground">
							{getMainFieldName(field_type)} - {field_type}
						</div>
					</div>
				</div>
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							removeSelectedField(field_name);
						}}
					>
						Remove
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="flex w-full justify-between">
			<div className="w-full py-3 border-r">
				<CollectionTypesHeader
					title={
						collectionNameValidation?.displayName
							? `Collection: ${collectionNameValidation.displayName}`
							: "New Collection Type"
					}
					tagline={
						isCollectionCreated
							? "Add fields to this collection"
							: "Define a new collection"
					}
					actions={
						isCollectionCreated && (
							<div className="flex items-center gap-2">
								<Button
									variant="destructive"
									size="sm"
									onClick={() => setShowDeleteConfirmDialog(true)}
									title="Delete collection"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										if (collectionNameValidation?.displayName) {
											setPrevCollectionName(
												collectionNameValidation.displayName,
											);
											setCollectionDraftName(
												collectionNameValidation.displayName,
											);
											setShowCreateCollectionDialog(true);
										}
									}}
								>
									Edit
								</Button>
							</div>
						)
					}
				/>
				<div className="space-y-4">
					{isCollectionCreated ? (
						<FieldManagement
							isCollectionCreated={isCollectionCreated}
							collectionNameValidation={collectionNameValidation}
							selectedFields={selectedFields}
							selectedTypes={selectedTypes}
							search={search}
							setSearch={setSearch}
							handleTypeSelect={handleTypeSelect}
							addSelectedFieldRequest={addSelectedFieldRequest}
							removeSelectedField={removeSelectedField}
							moveSelectedField={moveSelectedField}
							collectionType={collectionType}
							saveCollection={saveCollection}
						/>
					) : (
						<CollectionForm
							collectionNameInput={collectionNameInput}
							setCollectionNameInput={setCollectionNameInput}
							collectionNameValidation={collectionNameValidation}
							setCollectionNameValidation={setCollectionNameValidation}
							customPlural={customPlural}
							setCustomPlural={setCustomPlural}
							collectionType={collectionType}
							setCollectionType={setCollectionType}
							isCollectionCreated={isCollectionCreated}
							setIsCollectionCreated={setIsCollectionCreated}
							setPrevCollectionName={setPrevCollectionName}
							setCollectionDraftName={setCollectionDraftName}
						/>
					)}
				</div>
			</div>
			<div className="w-full py-3">
				<CollectionTypesHeader
					title={
						isCollectionCreated
							? `Selected Collection: ${collectionNameValidation?.displayName || "Collection"}`
							: "Selected Collection Type"
					}
					tagline="Review your selected fields"
				/>
				<ScrollArea className="h-[calc(100vh-200px)] px-4 py-3 pb-12 space-y-4 min-h-0 overflow-auto">
					{selectedFields.length === 0 ? (
						<div className="text-sm text-muted-foreground">
							No fields selected yet.
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={selectedFields}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-3">
									{selectedFields.map((field_name) => (
										<SortableItem
											key={field_name}
											field_name={field_name}
											field_type={selectedTypes[field_name]}
											removeSelectedField={removeSelectedField}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
					)}
					{selectedFields.length > 0 && (
						<div className="pt-4 border-t">
							<Button
								className="w-full"
								onClick={() => setShowSaveDialog(true)}
								disabled={
									selectedFields.length <
									(collectionType === "collection" ? 2 : 1)
								}
							>
								Save Collection
							</Button>

							<Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Save Collection</DialogTitle>
										<DialogDescription>
											Confirm to save your collection configuration. This will
											create a new collection type.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-2">
										<p>Are you sure you want to save this collection?</p>
									</div>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="ghost">Cancel</Button>
										</DialogClose>
										<Button
											onClick={async () => {
												await saveCollection();
												setShowSaveDialog(false);
											}}
										>
											Save
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							{selectedFields.length <
								(collectionType === "collection" ? 2 : 1) && (
								<p className="text-sm text-muted-foreground mt-2">
									{collectionType === "collection"
										? "Collection types require at least 2 fields"
										: "Single types require at least 1 field"}
								</p>
							)}
						</div>
					)}
				</ScrollArea>
			</div>

			<CollectionDialogs
				showCreateCollectionDialog={showCreateCollectionDialog}
				setShowCreateCollectionDialog={setShowCreateCollectionDialog}
				showDeleteConfirmDialog={showDeleteConfirmDialog}
				setShowDeleteConfirmDialog={setShowDeleteConfirmDialog}
				showFieldNameDialog={showFieldNameDialog}
				setShowFieldNameDialog={setShowFieldNameDialog}
				isCollectionCreated={isCollectionCreated}
				collectionDraftName={collectionDraftName}
				setCollectionDraftName={setCollectionDraftName}
				prevCollectionName={prevCollectionName}
				setPrevCollectionName={setPrevCollectionName}
				setCollectionNameInput={setCollectionNameInput}
				setCollectionNameValidation={setCollectionNameValidation}
				setCustomPlural={setCustomPlural}
				setSelectedFields={setSelectedFields}
				setSelectedTypes={setSelectedTypes}
				setIsCollectionCreated={setIsCollectionCreated}
				collectionNameValidation={collectionNameValidation}
				customPlural={customPlural}
				fieldBeingAdded={fieldBeingAdded}
				setFieldBeingAdded={setFieldBeingAdded}
				fieldNameError={fieldNameError}
				setFieldNameError={setFieldNameError}
				addSelectedField={addSelectedField}
			/>
		</div>
	);
};

export default CreateCollection;
