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
import {
	Calendar,
	Edit,
	FileText,
	GripVertical,
	Image as ImageIcon,
	Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import FieldCard from "@/components/FieldCard";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCollections } from "@/contexts/CollectionsContext";
import { FIELD_TYPES } from "@/types/fields";
import CollectionTypesHeader from "./CollectionTypesHeader";

const fieldNameSchema = z
	.string()
	.regex(
		/^[a-z][a-z0-9_]*$/,
		"Field name must be lowercase, snake_case, no spaces, no special characters beyond '_'",
	);

export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
}

interface CollectionField {
	field_name: string;
	type: string;
	label: string;
}

/**
 * Page component for viewing and managing fields of an existing collection.
 * Allows users to edit collection name, add new fields, and remove existing fields.
 * Provides a two-panel interface with current fields and available fields to add.
 *
 * @returns The collection builds/edits page for the specified collection
 */
const CollectionBuilds = () => {
	const { id } = useParams<{ id: string }>();
	const { collections, addCollection, deleteCollection } = useCollections();
	const navigate = useNavigate();
	const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
		{},
	);
	const [selectedFields, setSelectedFields] = useState<string[]>([]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	const [search, setSearch] = useState("");
	const [fieldBeingAdded, setFieldBeingAdded] = useState<{
		fieldName: string;
		type: string;
		field_name: string;
	} | null>(null);
	const [showFieldNameDialog, setShowFieldNameDialog] = useState(false);
	const [fieldNameError, setFieldNameError] = useState<string>("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showSaveDialog, setShowSaveDialog] = useState(false);

	const collection = id ? collections.find((c) => c.id === id) : null;

	React.useEffect(() => {
		if (collection) {
			const fields = collection.fields.map((f) => f.field_name);
			const types: Record<string, string> = {};
			collection.fields.forEach((f) => {
				types[f.field_name] = f.type;
			});
			setSelectedFields(fields);
			setSelectedTypes(types);
		}
	}, [collection]);

	/**
	 * Saves the updated collection fields to the context.
	 * Updates the collection with the new field configuration.
	 */
	const saveChanges = () => {
		if (!collection) return;

		const fields: CollectionField[] = selectedFields.map((field_name) => ({
			field_name,
			type: selectedTypes[field_name],
			label: getMainFieldName(selectedTypes[field_name]),
		}));

		const updatedCollection = {
			...collection,
			fields,
		};

		addCollection(updatedCollection);
	};

	/**
	 * Maps icon names to their corresponding icon components.
	 *
	 * @param iconName - The name of the icon to retrieve
	 * @returns The icon component or a default FileText icon
	 */
	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "FileText":
				return <FileText className="h-4 w-4 text-muted-foreground" />;
			case "Edit":
				return <Edit className="h-4 w-4 text-muted-foreground" />;
			case "Calendar":
				return <Calendar className="h-4 w-4 text-muted-foreground" />;
			case "Image":
				return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
			default:
				return <FileText className="h-4 w-4 text-muted-foreground" />;
		}
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
		// Prevent adding more than 1 field for single-type collections
		if (collection?.type === "single" && selectedFields.length >= 1) {
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

		if (collection?.type === "single" && selectedFields.length >= 1) {
			toast.error("Single types can only have one field.");
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

	const filteredFields = collectionFields.filter((field) =>
		field.name.toLowerCase().includes(search.toLowerCase()),
	);

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

	if (!collection) {
		return <div>Collection not found</div>;
	}

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
			useSortable({ id: field_name });

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
		};

		return (
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				className="flex items-center justify-between p-3 border rounded bg-muted/50"
			>
				<div className="flex items-center gap-3">
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
				<Button
					variant="ghost"
					size="sm"
					onClick={() => removeSelectedField(field_name)}
				>
					Remove
				</Button>
			</div>
		);
	};

	return (
		<TooltipProvider>
			<div className="flex w-full justify-between">
				<div className="w-1/2 py-3 border-r">
					<div className="relative">
						<CollectionTypesHeader
							title={`Current Fields: ${collection.name}`}
							tagline="View and manage existing fields"
						/>
						<div className="absolute right-4 top-3">
							<Button
								variant="destructive"
								size="sm"
								onClick={() => setShowDeleteDialog(true)}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete Collection
							</Button>
						</div>
					</div>
					<div className="px-4 py-3 space-y-4">
						{selectedFields.length === 0 ? (
							<div className="text-sm text-muted-foreground">
								No fields configured.
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
								>
									Save Changes
								</Button>
								<Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Save Changes</DialogTitle>
										</DialogHeader>
										<div className="space-y-2">
											<p>Save the changes to this collection?</p>
										</div>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant="ghost">Cancel</Button>
											</DialogClose>
											<Button
												onClick={() => {
													saveChanges();
													setShowSaveDialog(false);
													toast.success("Collection updated successfully.");
												}}
											>
												Save
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						)}
					</div>
				</div>
				<div className="w-1/2 py-3">
					<CollectionTypesHeader
						title="Add More Fields"
						tagline="Select additional fields to add to this collection"
					/>
					<div className="px-4 py-3 space-y-4">
						<Input
							placeholder="Search fields..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="mb-4"
						/>
						{filteredFields.map((fieldGroup) => (
							<FieldCard
								key={fieldGroup.name}
								fieldGroup={fieldGroup}
								selectedTypes={selectedTypes}
								handleTypeSelect={handleTypeSelect}
								getIcon={getIcon}
								onAdd={addSelectedFieldRequest}
							/>
						))}
					</div>
				</div>
			</div>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Collection</DialogTitle>
					</DialogHeader>
					<div className="space-y-2">
						<p>
							Are you sure you want to delete the collection "{collection.name}
							"? This action cannot be undone.
						</p>
					</div>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								if (id) {
									deleteCollection(id);
									navigate("/collection-types-builder");
								}
							}}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showFieldNameDialog} onOpenChange={setShowFieldNameDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Enter Field Name</DialogTitle>
					</DialogHeader>

					<div className="space-y-2">
						<Label htmlFor="fieldName">Field Name</Label>
						<Input
							id="fieldName"
							value={fieldBeingAdded?.field_name || ""}
							onChange={(e) => {
								const value = e.target.value;
								setFieldBeingAdded((prev) =>
									prev ? { ...prev, field_name: value } : prev,
								);
								const result = fieldNameSchema.safeParse(value);
								if (result.success) {
									setFieldNameError("");
								} else {
									setFieldNameError(result.error.issues[0].message);
								}
							}}
						/>
						{fieldNameError && (
							<div className="text-sm text-red-500">{fieldNameError}</div>
						)}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>
						<Button
							onClick={() => {
								if (fieldBeingAdded?.field_name?.trim() && !fieldNameError) {
									addSelectedField(
										fieldBeingAdded.type,
										fieldBeingAdded.field_name.trim(),
									);
								}
							}}
							disabled={
								!fieldBeingAdded?.field_name?.trim() || !!fieldNameError
							}
						>
							Add Field
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
};

export default CollectionBuilds;
