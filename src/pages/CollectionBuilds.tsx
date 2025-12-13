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
	ToggleLeft,
	Hash,
	Globe,
	Palette,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";
import FieldCard from "@/components/FieldCard";
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
import { FIELD_TYPES } from "@/types/fields";
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

const normalizeToCamelCase = (name: string): string => {
	return name
		.split(/[_\s-]+/)
		.map((word, index) => {
			if (index === 0) return word.toLowerCase();
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join("");
};

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

interface CollectionField {
	field_name: string;
	type: string;
	label: string;
}

const CollectionBuilds = () => {
	const { id } = useParams<{ id: string }>();
	const { collections, updateCollection, deleteCollection } = useCollections();
	const navigate = useNavigate();

	const [sidebarSelections, setSidebarSelections] = useState<
		Record<string, string>
	>({});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [search, setSearch] = useState("");
	const [currentFieldsSearch, setCurrentFieldsSearch] = useState("");
	const [fieldBeingAdded, setFieldBeingAdded] = useState<{
		fieldName: string;
		type: string;
		field_name: string;
	} | null>(null);

	const [showFieldNameDialog, setShowFieldNameDialog] = useState(false);
	const [fieldNameError, setFieldNameError] = useState<string>("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const collection = id ? collections.find((c) => c.id === id) : null;
	const currentFields = collection?.fields || [];

	const collectionFields = FIELD_TYPES;

	const getMainFieldName = (type: string) => {
		for (const field of collectionFields) {
			if (field.types.some((t) => t.type === type)) {
				return field.name;
			}
		}
		return type;
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

	/**
	 * Persist changes to the database immediately.
	 */
	const persistCollectionUpdate = async (newFields: CollectionField[]) => {
		if (!collection) return;

		const updatedCollection = {
			id: collection.id,
			name: collection.name,
			singular: collection.singular,
			plural: collection.plural,
			type: collection.type,
			fields: newFields,
		};

		try {
			await updateCollection(collection.id, updatedCollection);
		} catch (error) {
			console.error("Auto-save failed:", error);
			toast.error("Failed to save changes.");
		}
	};

	const handleSidebarTypeSelect = (groupName: string, type: string) => {
		setSidebarSelections((prev) => ({ ...prev, [groupName]: type }));
	};

	const addSelectedFieldRequest = (groupName: string, type: string) => {
		if (collection?.type === "single" && currentFields.length >= 1) {
			toast.error("Single types can only have one field.");
			return;
		}

		setSidebarSelections((prev) => ({ ...prev, [groupName]: type }));
		setFieldBeingAdded({ fieldName: groupName, type, field_name: "" });
		setFieldNameError("");
		setShowFieldNameDialog(true);
	};

	const addSelectedField = async (type: string, field_name: string) => {
		if (currentFields.some((f) => f.field_name === field_name)) {
			toast.error("Field already exists.");
			return;
		}

		if (collection?.type === "single" && currentFields.length >= 1) {
			toast.error("Single types can only have one field.");
			return;
		}

		const newField: CollectionField = {
			field_name,
			type,
			label: getMainFieldName(type),
		};

		const newFields = [...currentFields, newField];

		await persistCollectionUpdate(newFields);
		toast.success(`Field "${field_name}" added.`);

		setFieldBeingAdded(null);
		setShowFieldNameDialog(false);
	};

	const removeField = async (field_name: string) => {
		const newFields = currentFields.filter((f) => f.field_name !== field_name);
		await persistCollectionUpdate(newFields);
		toast.success(`Field "${field_name}" removed.`);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = currentFields.findIndex(
				(f) => f.field_name === active.id,
			);
			const newIndex = currentFields.findIndex((f) => f.field_name === over.id);

			const newFields = arrayMove(currentFields, oldIndex, newIndex);

			await persistCollectionUpdate(newFields);
		}
	};

	const filteredFields = collectionFields.filter((field) =>
		field.name.toLowerCase().includes(search.toLowerCase()),
	);

	const filteredCurrentFields = currentFields.filter(
		(f) =>
			f.field_name.toLowerCase().includes(currentFieldsSearch.toLowerCase()) ||
			f.label.toLowerCase().includes(currentFieldsSearch.toLowerCase()),
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

	const SortableItem = ({
		field,
		onRemove,
	}: {
		field: CollectionField;
		onRemove: (name: string) => void;
	}) => {
		const { attributes, listeners, setNodeRef, transform, transition } =
			useSortable({ id: field.field_name });

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
						<div className="text-sm font-medium">{field.field_name}</div>
						<div className="text-xs text-muted-foreground">
							{field.label} - {field.type}
						</div>
					</div>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onRemove(field.field_name)}
				>
					Remove
				</Button>
			</div>
		);
	};

	return (
		<TooltipProvider>
			<div className="flex w-full justify-between">
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
									{currentFields.length === 0
										? "No fields configured."
										: "No matching fields found."}
								</div>
							) : (
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={handleDragEnd}
								>
										<ScrollArea className="h-[calc(100vh-200px)] w-full py-2 min-h-0 overflow-auto bg-background px-2 border">
											<SortableContext
												items={filteredCurrentFields.map((f) => f.field_name)}
												strategy={verticalListSortingStrategy}
											>
												<div className="space-y-3">
													{filteredCurrentFields.map((field) => (
												<SortableItem
													key={field.field_name}
													field={field}
													onRemove={removeField}
												/>
											))}
										</div>
									</SortableContext>
									</ScrollArea>
								</DndContext>
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
			</div>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Collection</DialogTitle>
						<DialogDescription>
							This action cannot be undone. All data associated with this
							collection will be permanently removed.
						</DialogDescription>
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
