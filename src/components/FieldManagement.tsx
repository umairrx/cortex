import FieldCard from "@/components/FieldCard";
import CollectionTypesHeader from "@/pages/CollectionTypesHeader";
import { FIELD_TYPES } from "@/types/fields";
import type { CollectionNameValidationResult } from "@/utils/collectionNameValidator";
import { ScrollArea } from "./ui/scroll-area";

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
	selectedTypes,
	search,
	setSearch,
	handleTypeSelect,
	addSelectedFieldRequest,
}: FieldManagementProps) => {
	const getIcon = (iconName: string) => {
		// This logic should be moved to a utility or kept in the main component
		switch (iconName) {
			default:
				return null;
		}
	};

	const filteredFields = FIELD_TYPES.filter((field) =>
		field.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<ScrollArea className="h-[calc(100vh-200px)] w-full py-3 min-h-0 overflow-auto">
			<CollectionTypesHeader
				title={
					isCollectionCreated
						? `Selected Collection: ${collectionNameValidation?.displayName || "Collection"}`
						: "Selected Collection Type"
				}
				tagline="Review your selected fields"
			/>
			<div className="py-3 px-3 space-y-2">
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
		</ScrollArea>
	);
};
