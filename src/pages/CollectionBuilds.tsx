import {
	Calendar,
	Edit,
	FileText,
	Globe,
	Hash,
	Image as ImageIcon,
	Palette,
	ToggleLeft,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CollectionBuilderLayout from "@/components/CollectionBuilderLayout";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import FieldCard from "@/components/FieldCard";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCollections } from "@/contexts/CollectionsContext";
import { useFieldManagement } from "@/hooks/useFieldManagement";
import { FIELD_TYPES } from "@/types/fields";
import type { CollectionField } from "@/types/types";
import CollectionTypesHeader from "./CollectionTypesHeader";

/**
 * Reserved keywords that cannot be used as field names.
 */
const RESERVED_WORDS = new Set([
	"abstract",
	"arguments",
	"await",
	"boolean",
	"break",
	"byte",
	"case",
	"catch",
	"char",
	"class",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"double",
	"else",
	"enum",
	"eval",
	"export",
	"extends",
	"false",
	"final",
	"finally",
	"float",
	"for",
	"function",
	"goto",
	"if",
	"implements",
	"import",
	"in",
	"instanceof",
	"int",
	"interface",
	"let",
	"long",
	"native",
	"new",
	"null",
	"package",
	"private",
	"protected",
	"public",
	"return",
	"short",
	"static",
	"super",
	"switch",
	"synchronized",
	"this",
	"throw",
	"throws",
	"transient",
	"true",
	"try",
	"typeof",
	"var",
	"void",
	"volatile",
	"while",
	"with",
	"yield",
	"id",
	"type",
	"data",
	"value",
	"result",
	"error",
	"message",
	"status",
	"code",
	"response",
	"request",
	"meta",
	"config",
	"options",
	"params",
	"args",
	"props",
	"state",
]);

/**
 * Normalizes a field name to camelCase format.
 * Transforms spaces, hyphens, and underscores to standard camelCase.
 *
 * @param name - The input string to normalize
 * @returns The camelCase version of the input string
 */
const normalizeToCamelCase = (name: string): string => {
	return name
		.split(/[_\s-]+/)
		.map((word, index) => {
			if (index === 0) return word.toLowerCase();
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join("");
};

/**
 * Validates a field name against specific rules.
 * Checks for empty values, invalid characters, starting numbers, and reserved words.
 *
 * @param name - The field name to validate
 * @returns An error message string if invalid, or an empty string if valid
 */
const validateFieldName = (name: string): string => {
	if (!name.trim()) return "Field name is required";
	const trimmed = name.trim();

	if (!/^[a-z][a-zA-Z0-9]*$/.test(trimmed)) {
		if (/\s/.test(trimmed))
			return "Field name cannot contain spaces. Use camelCase instead.";
		if (/^[0-9]/.test(trimmed))
			return "Field name must start with a lowercase letter, not a number.";
		if (/[^a-zA-Z0-9]/.test(trimmed))
			return "Field name can only contain letters and numbers. Use camelCase for multi-word names.";
	}

	if (!/^[a-z]/.test(trimmed))
		return "Field name must start with a lowercase letter.";
	if (trimmed.length < 2)
		return "Field name must be descriptive and at least 2 characters.";
	if (RESERVED_WORDS.has(trimmed))
		return `"${trimmed}" is a reserved word and cannot be used.`;

	return "";
};

export interface FieldType {
	type: string;
	label: string;
	maxLength?: number;
}

/**
 * Component for managing fields of an existing collection.
 * Allows adding, removing, and reordering fields in a collection type.
 *
 * @returns The collection build interface
 */
const CollectionBuilds = () => {
	const { id } = useParams<{ id: string }>();
	const { collections, updateCollection, deleteCollection } = useCollections();
	const navigate = useNavigate();

	const [sidebarSelections, setSidebarSelections] = useState<
		Record<string, string>
	>({});

	const [search, setSearch] = useState("");
	const [currentFieldsSearch, setCurrentFieldsSearch] = useState("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const collection = id ? collections.find((c) => c.id === id) : null;
	const collectionFields = FIELD_TYPES;

	/**
	 * Retrieves the human-readable label for a given field type.
	 *
	 * @param type - The field type identifier
	 * @returns The display name for the field type
	 */
	const getMainFieldName = (type: string) => {
		for (const field of collectionFields) {
			if (field.types.some((t) => t.type === type)) {
				return field.name;
			}
		}
		return type;
	};

	const initialFields = collection?.fields.map((f) => f.field_name) || [];
	const initialTypes =
		collection?.fields.reduce(
			(acc, f) => {
				acc[f.field_name] = f.type;
				return acc;
			},
			{} as Record<string, string>,
		) || {};

	/**
	 * Persists changes to the collection fields to the backend.
	 * Updates the collection definition with the new field configuration.
	 *
	 * @param fields - The list of field names
	 * @param types - The map of field name to type
	 */
	const persistChanges = async (
		fields: string[],
		types: Record<string, string>,
	) => {
		if (!collection) return;

		const newFields: CollectionField[] = fields.map((name) => ({
			field_name: name,
			type: types[name],
			label: getMainFieldName(types[name]),
		}));

		try {
			await updateCollection(collection.id, {
				...collection,
				fields: newFields,
			});
		} catch (error) {
			console.error("Auto-save failed:", error);
			toast.error("Failed to save changes.");
		}
	};

	const {
		selectedFields,
		selectedTypes,
		setSelectedFields,
		setSelectedTypes,
		fieldBeingAdded,
		setFieldBeingAdded,
		showFieldNameDialog,
		setShowFieldNameDialog,
		fieldNameError,
		setFieldNameError,
		sensors,
		handleDragEnd,
		addSelectedFieldRequest: hookAddRequest,
		addSelectedField,
		removeSelectedField,
	} = useFieldManagement({
		initialFields,
		initialTypes,
		collectionType: collection?.type,
		onFieldsChange: persistChanges,
	});

	useEffect(() => {
		if (collection) {
			setSelectedFields(collection.fields.map((f) => f.field_name));
			setSelectedTypes(
				collection.fields.reduce(
					(acc, f) => {
						acc[f.field_name] = f.type;
						return acc;
					},
					{} as Record<string, string>,
				),
			);
		}
	}, [collection, setSelectedFields, setSelectedTypes]);

	const handleSidebarTypeSelect = (groupName: string, type: string) => {
		setSidebarSelections((prev) => ({ ...prev, [groupName]: type }));
	};

	const addSelectedFieldRequest = (groupName: string, type: string) => {
		setSidebarSelections((prev) => ({ ...prev, [groupName]: type }));
		hookAddRequest(groupName, type);
	};

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
			case "ToggleLeft":
				return <ToggleLeft className="h-4 w-4 text-muted-foreground" />;
			case "Hash":
				return <Hash className="h-4 w-4 text-muted-foreground" />;
			case "Globe":
				return <Globe className="h-4 w-4 text-muted-foreground" />;
			case "Palette":
				return <Palette className="h-4 w-4 text-muted-foreground" />;
			default:
				return <FileText className="h-4 w-4 text-muted-foreground" />;
		}
	};

	const filteredFields = collectionFields.filter((field) =>
		field.name.toLowerCase().includes(search.toLowerCase()),
	);

	const filteredCurrentFields = selectedFields.filter((field_name) =>
		field_name.toLowerCase().includes(currentFieldsSearch.toLowerCase()),
	);

	if (!collection) {
		return (
			<EmptyState
				icon={FileText}
				title="Collection Not Found"
				description="The collection you're looking for doesn't exist or has been deleted."
			/>
		);
	}

	return (
		<TooltipProvider>
			<CollectionBuilderLayout>
				<div className="w-1/2 py-3 border-r flex flex-col h-full overflow-hidden">
					<div className="flex-none">
						<CollectionTypesHeader
							title={`Current Fields: ${collection.name}`}
							tagline="View and manage existing fields"
							actions={
								<Button
									variant="destructive"
									size="sm"
									onClick={() => setShowDeleteDialog(true)}
								>
									<Trash2 className="h-4 w-4 mr-2" />
								</Button>
							}
						/>
					</div>

					<div className="px-4 py-3 space-y-4">
						<Input
							placeholder="Search current fields..."
							value={currentFieldsSearch}
							onChange={(e) => setCurrentFieldsSearch(e.target.value)}
							className="mb-4"
						/>
						{filteredCurrentFields.length === 0 ? (
							<div className="text-sm text-muted-foreground">
								{selectedFields.length === 0
									? "No fields configured."
									: "No matching fields found."}
							</div>
						) : (
							<div className="h-[calc(100vh-200px)] w-full py-2 min-h-0 overflow-auto bg-background px-2 border">
								<SortableFieldList
									selectedFields={filteredCurrentFields}
									selectedTypes={selectedTypes}
									removeSelectedField={removeSelectedField}
									handleDragEnd={handleDragEnd}
									sensors={sensors}
								/>
							</div>
						)}
					</div>
				</div>
				<div className="w-1/2 py-3 flex flex-col h-full overflow-hidden">
					<div className="flex-none">
						<CollectionTypesHeader
							title="Add More Fields"
							tagline="Select additional fields to add to this collection"
						/>
					</div>
					<div className="px-4 py-3 space-y-4">
						<Input
							placeholder="Search fields..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="mb-4"
						/>
						<ScrollArea className="h-[calc(100vh-200px)] w-full py-2 min-h-0 overflow-auto bg-background px-2 border">
							{filteredFields.map((fieldGroup) => (
								<FieldCard
									key={fieldGroup.name}
									fieldGroup={fieldGroup}
									selectedTypes={sidebarSelections}
									handleTypeSelect={handleSidebarTypeSelect}
									getIcon={getIcon}
									onAdd={addSelectedFieldRequest}
								/>
							))}
						</ScrollArea>
					</div>
				</div>
			</CollectionBuilderLayout>

			<ConfirmDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				title="Delete Collection"
				description={`Are you sure you want to delete the collection "${collection.name}"? This action cannot be undone. All data associated with this collection will be permanently removed.`}
				confirmLabel="Delete"
				onConfirm={() => {
					if (id) {
						deleteCollection(id);
						navigate("/collection-types-builder");
					}
				}}
				variant="destructive"
			/>

			<Dialog open={showFieldNameDialog} onOpenChange={setShowFieldNameDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Enter Field Name</DialogTitle>
						<DialogDescription>
							Enter a unique name for this field. Use camelCase (e.g., authorId,
							isPublished).
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<Label htmlFor="fieldName">Field Name (camelCase)</Label>
						<Input
							id="fieldName"
							placeholder="e.g., authorId, publishedAt, isPublished, tags"
							value={fieldBeingAdded?.field_name || ""}
							onChange={(e) => {
								const value = e.target.value;
								setFieldBeingAdded((prev) =>
									prev ? { ...prev, field_name: value } : prev,
								);
								const errorMsg = validateFieldName(value.trim());
								setFieldNameError(errorMsg);
							}}
						/>
						{fieldNameError && (
							<div className="text-sm text-red-500">{fieldNameError}</div>
						)}
						{fieldBeingAdded?.field_name?.trim() && !fieldNameError && (
							<div className="text-xs text-green-600">
								✓ Field name is valid
							</div>
						)}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>
						<Button
							onClick={() => {
								if (fieldBeingAdded?.field_name?.trim() && !fieldNameError) {
									const normalized = normalizeToCamelCase(
										fieldBeingAdded.field_name.trim(),
									);
									addSelectedField(fieldBeingAdded.type, normalized);
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
