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
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import CollectionTypesHeader from "@/pages/CollectionTypesHeader";
import { FIELD_TYPES } from "@/types/fields";
import type { CollectionNameValidationResult } from "@/utils/collectionNameValidator";

interface FieldManagementProps {
	isCollectionCreated: boolean;
	collectionNameValidation: CollectionNameValidationResult | null;
	selectedFields: string[];
	selectedTypes: Record<string, string>;
	search: string;
	setSearch: (value: string) => void;
	handleTypeSelect: (fieldName: string, type: string) => void;
	addSelectedFieldRequest: (fieldName: string, type: string) => void;
	removeSelectedField: (field_name: string) => void;
	collectionType: "collection" | "single";
	saveCollection: () => void;
	moveSelectedField: (from: number, to: number) => void;
}

/**
 * Component for managing field selection and the selected fields list
 */
export const FieldManagement = ({
	isCollectionCreated,
	collectionNameValidation,
	selectedFields,
	selectedTypes,
	search,
	setSearch,
	handleTypeSelect,
	addSelectedFieldRequest,
	removeSelectedField,
	collectionType,
	saveCollection,
	moveSelectedField,
}: FieldManagementProps) => {
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const fromIndex = selectedFields.indexOf(active.id as string);
			const toIndex = selectedFields.indexOf(over.id as string);

			if (fromIndex !== -1 && toIndex !== -1) {
				moveSelectedField(fromIndex, toIndex);
			}
		}
	};

	const getIcon = (iconName: string) => {
		// This logic should be moved to a utility or kept in the main component
		switch (iconName) {
			default:
				return null;
		}
	};

	const getMainFieldName = (type: string) => {
		for (const field of FIELD_TYPES) {
			if (field.types.some((t) => t.type === type)) {
				return field.name;
			}
		}
		return type;
	};

	const filteredFields = FIELD_TYPES.filter((field) =>
		field.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="w-full py-3">
			<CollectionTypesHeader
				title={
					isCollectionCreated
						? `Selected Collection: ${collectionNameValidation?.displayName || "Collection"}`
						: "Selected Collection Type"
				}
				tagline="Review your selected fields"
			/>
			<div className="py-3 px-3 space-y-4">
				{isCollectionCreated ? (
					<>
						<div className="mb-4">
							<input
								type="text"
								placeholder="Search fields..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full px-3 py-2 border rounded-md"
							/>
						</div>
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
					</>
				) : (
					<div className="text-sm text-muted-foreground">
						Create a collection first to add fields
					</div>
				)}
			</div>

			{selectedFields.length > 0 && (
				<div className="px-4 py-3 border-t">
					<h3 className="text-sm font-medium mb-3">Selected Fields</h3>
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
										getMainFieldName={getMainFieldName}
										removeSelectedField={removeSelectedField}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>

					<div className="pt-4 border-t mt-4">
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
								</DialogHeader>
								<div className="space-y-2">
									<p>Are you sure you want to save this collection?</p>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="ghost">Cancel</Button>
									</DialogClose>
									<Button
										onClick={() => {
											saveCollection();
											setShowSaveDialog(false);
											toast.success("Collection saved successfully.");
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
				</div>
			)}
		</div>
	);
};

/**
 * Sortable field item component
 */
const SortableItem = ({
	field_name,
	field_type,
	getMainFieldName,
	removeSelectedField,
}: {
	field_name: string;
	field_type: string;
	getMainFieldName: (type: string) => string;
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
