import type { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CollectionBuilderLayout from "@/components/CollectionBuilderLayout";
import { CollectionDialogs } from "@/components/CollectionDialogs";
import { CollectionForm } from "@/components/CollectionForm";
import { FieldManagement } from "@/components/FieldManagement";
import { SortableFieldList } from "@/components/SortableFieldList";
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
import { useFieldManagement } from "@/hooks/useFieldManagement";
import CollectionTypesHeader from "@/pages/CollectionTypesHeader";
import { FIELD_TYPES } from "@/types/fields";
import type { CollectionField } from "@/types/types";
import type { CollectionNameValidationResult } from "@/utils/collectionNameValidator";

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
	const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

	const {
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
	} = useFieldManagement({ collectionType });

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

	return (
		<CollectionBuilderLayout>
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
						<SortableFieldList
							selectedFields={selectedFields}
							selectedTypes={selectedTypes}
							removeSelectedField={removeSelectedField}
							handleDragEnd={handleDragEnd}
							sensors={sensors}
						/>
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
		</CollectionBuilderLayout>
	);
};

export default CreateCollection;
