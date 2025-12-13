import CollectionTypesHeader from "./CollectionTypesHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Edit,
  Calendar,
  Image as ImageIcon,
  Trash2,
  GripVertical,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldCard from "@/components/FieldCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const fieldNameSchema = z
  .string()
  .regex(
    /^[a-z][a-z0-9_]*$/,
    "Field name must be lowercase, snake_case, no spaces, no special characters beyond '_'"
  );

export interface FieldType {
  type: string;
  label: string;
  maxLength?: number;
}

const CreateCollection = () => {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
    {}
  );
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [collectionName, setCollectionName] = useState<string>("");
  const [collectionType, setCollectionType] = useState<"collection" | "single">(
    "collection"
  );
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] =
    useState(false);
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
    })
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
        className="flex items-center justify-between p-3 border rounded"
      >
        <div className="flex items-center gap-2">
          <span {...listeners} className="cursor-move">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </span>
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

  const getIcon = (name: string) => {
    switch (name) {
      case "Text":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "Rich Content":
        return <Edit className="h-4 w-4 text-muted-foreground" />;
      case "Date":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case "Image":
        return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getMainFieldName = (type: string) => {
    for (const field of collectionFields) {
      if (field.types.some((t) => t.type === type)) {
        return field.name;
      }
    }
    return type; // fallback
  };

  const collectionFields: { name: string; types: FieldType[] }[] = [
    {
      name: "Text",
      types: [
        { type: "short", label: "Short Text", maxLength: 100 },
        { type: "long", label: "Long Text", maxLength: 300 },
      ],
    },
    {
      name: "Rich Content",
      types: [
        { type: "richtext", label: "Rich Text" },
        { type: "richmarkdown", label: "Rich Markdown" },
      ],
    },
    {
      name: "Date",
      types: [{ type: "date", label: "Date" }],
    },
    {
      name: "Image",
      types: [
        { type: "single", label: "Single Image" },
        { type: "multiple", label: "Multiple Images" },
      ],
    },
  ];

  const handleTypeSelect = (fieldName: string, type: string) => {
    setSelectedTypes((prev) => ({ ...prev, [fieldName]: type }));
  };

  const addSelectedFieldRequest = (fieldName: string, type: string) => {
    setSelectedTypes((prev) => ({ ...prev, [fieldName]: type }));

    // open the dialog for entering a field name
    setFieldBeingAdded({ fieldName, type, field_name: "" });
    setFieldNameError("");
    setShowFieldNameDialog(true);
  };

  const addSelectedField = (type: string, field_name: string) => {
    if (selectedFields.includes(field_name)) {
      // Already exists, maybe show error, but for now, do nothing
      return;
    }
    setSelectedTypes((prev) => ({ ...prev, [field_name]: type }));
    setSelectedFields((prev) => [...prev, field_name]);
    setFieldBeingAdded(null);
    setShowFieldNameDialog(false);
  };

  const removeSelectedField = (field_name: string) => {
    setSelectedFields((prev) => prev.filter((f) => f !== field_name));
    setSelectedTypes((prev) => {
      const copy = { ...prev };
      delete copy[field_name];
      return copy;
    });
  };

  const filteredFields = collectionFields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="flex w-full justify-between">
        <div className="w-1/2 py-3 border-r">
          <div className="relative">
            <CollectionTypesHeader
              title={
                collectionName
                  ? `Collection: ${collectionName}`
                  : "New Collection Type"
              }
              tagline={
                isCollectionCreated
                  ? "Add fields to this collection"
                  : "Define a new collection"
              }
            />
            {isCollectionCreated && (
              <div className="absolute right-4 top-3 flex items-center gap-2">
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
                    setPrevCollectionName(collectionName);
                    setCollectionDraftName(collectionName);
                    setShowCreateCollectionDialog(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <div className="px-4 py-3 space-y-4">
            {isCollectionCreated ? (
              <>
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
              </>
            ) : (
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Create New Collection</CardTitle>
                  <CardDescription>
                    Define your collection name and type to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="collectionName">Collection Name</Label>
                    <Input
                      id="collectionName"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      placeholder="e.g., Blog Posts"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Collection Type</Label>
                    <RadioGroup
                      value={collectionType}
                      onValueChange={(value) =>
                        setCollectionType(value as "collection" | "single")
                      }
                      className="grid grid-cols-1 gap-3"
                    >
                      <div
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => setCollectionType("collection")}
                      >
                        <RadioGroupItem value="collection" id="collection" />
                        <div className="flex-1">
                          <Label
                            htmlFor="collection"
                            className="font-medium cursor-pointer"
                          >
                            Collection Types
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Multiple entries with the same structure
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => setCollectionType("single")}
                      >
                        <RadioGroupItem value="single" id="single" />
                        <div className="flex-1">
                          <Label
                            htmlFor="single"
                            className="font-medium cursor-pointer"
                          >
                            Single Types
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Single entry with unique content
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!collectionName.trim()}
                    onClick={() => {
                      if (collectionName.trim()) {
                        setPrevCollectionName(collectionName);
                        setCollectionDraftName(collectionName);
                        setIsCollectionCreated(true);
                      }
                    }}
                  >
                    Create Collection
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className="w-1/2 py-3">
          <CollectionTypesHeader
            title={
              isCollectionCreated
                ? `Selected Collection: ${collectionName}`
                : "Selected Collection Type"
            }
            tagline="Review your selected fields"
          />
          <div className="px-4 py-3 space-y-4">
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
          </div>
        </div>
      </div>

      {/* Collection create/edit dialog */}
      <Dialog
        open={showCreateCollectionDialog}
        onOpenChange={setShowCreateCollectionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCollectionCreated
                ? "Edit Collection"
                : "Create New Collection"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="collectionDraftName">Collection Name</Label>
            <Input
              id="collectionDraftName"
              value={collectionDraftName}
              onChange={(e) => setCollectionDraftName(e.target.value)}
              placeholder="e.g., Blog Posts"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                // Discard changes and revert
                setCollectionDraftName(prevCollectionName);
                setShowCreateCollectionDialog(false);
                if (!isCollectionCreated) {
                  setCollectionName("");
                  setSelectedFields([]);
                  setSelectedTypes({});
                } else {
                  setCollectionName(prevCollectionName);
                }
              }}
            >
              Discard
            </Button>
            <Button
              disabled={!collectionDraftName.trim()}
              onClick={() => {
                if (collectionDraftName.trim()) {
                  setCollectionName(collectionDraftName.trim());
                  setPrevCollectionName(collectionDraftName.trim());
                  setIsCollectionCreated(true);
                  setShowCreateCollectionDialog(false);
                }
              }}
            >
              {isCollectionCreated ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={showDeleteConfirmDialog}
        onOpenChange={setShowDeleteConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              Are you sure you want to discard the collection "{collectionName}
              "? This will remove all selected fields.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // delete and reset
                setCollectionName("");
                setPrevCollectionName("");
                setCollectionDraftName("");
                setSelectedFields([]);
                setSelectedTypes({});
                setIsCollectionCreated(false);
                setShowDeleteConfirmDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field name dialog */}
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
                  prev ? { ...prev, field_name: value } : prev
                );
                // Validate
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
              <Button
                onClick={() => {
                  if (
                    fieldBeingAdded?.field_name &&
                    fieldBeingAdded?.field_name.trim() &&
                    !fieldNameError
                  ) {
                    addSelectedField(
                      fieldBeingAdded.type,
                      fieldBeingAdded.field_name.trim()
                    );
                  }
                }}
                disabled={
                  !fieldBeingAdded?.field_name?.trim() || !!fieldNameError
                }
              >
                Add Field
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default CreateCollection;
