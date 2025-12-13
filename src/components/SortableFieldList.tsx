import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type SensorDescriptor,
	type SensorOptions,
} from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFieldGroup } from "@/types/fields";

const getMainFieldName = (type: string) => {
	const group = getFieldGroup(type);
	return group ? group.name : type;
};

interface SortableItemProps {
	field_name: string;
	field_type: string;
	removeSelectedField: (field_name: string) => void;
}

const SortableItem = ({
	field_name,
	field_type,
	removeSelectedField,
}: SortableItemProps) => {
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
			className="flex items-center justify-between p-3 border rounded bg-card text-card-foreground"
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					{...listeners}
					{...attributes}
					aria-label="Drag field"
					className="cursor-move touch-none p-1 bg-transparent hover:text-primary transition-colors"
					style={{ touchAction: "none" }}
				>
					<GripVertical className="h-5 w-5" />
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
					className="text-destructive hover:text-destructive hover:bg-destructive/10"
				>
					Remove
				</Button>
			</div>
		</div>
	);
};

interface SortableFieldListProps {
	selectedFields: string[];
	selectedTypes: Record<string, string>;
	removeSelectedField: (field_name: string) => void;
	handleDragEnd: (event: DragEndEvent) => void;
	sensors: SensorDescriptor<SensorOptions>[];
}

export const SortableFieldList = ({
	selectedFields,
	selectedTypes,
	removeSelectedField,
	handleDragEnd,
	sensors,
}: SortableFieldListProps) => {
	if (selectedFields.length === 0) {
		return (
			<div className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-lg">
				No fields selected yet. Add fields from the left sidebar.
			</div>
		);
	}

	return (
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
	);
};
