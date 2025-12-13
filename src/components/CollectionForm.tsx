import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CollectionNameValidationResult } from "@/utils/collectionNameValidator";
import { CollectionNameInput } from "./CollectionNameInput";
import { CollectionTypeSelector } from "./CollectionTypeSelector";

interface CollectionFormProps {
	collectionNameInput: string;
	setCollectionNameInput: (value: string) => void;
	collectionNameValidation: CollectionNameValidationResult | null;
	setCollectionNameValidation: (
		validation: CollectionNameValidationResult | null,
	) => void;
	customPlural: string;
	setCustomPlural: (value: string) => void;
	collectionType: "collection" | "single";
	setCollectionType: (type: "collection" | "single") => void;
	isCollectionCreated: boolean;
	setIsCollectionCreated: (created: boolean) => void;
	setPrevCollectionName: (name: string) => void;
	setCollectionDraftName: (name: string) => void;
}

/**
 * Main collection creation form component
 */
export const CollectionForm = ({
	collectionNameInput,
	setCollectionNameInput,
	collectionNameValidation,
	setCollectionNameValidation,
	customPlural,
	setCustomPlural,
	collectionType,
	setCollectionType,
	isCollectionCreated,
	setIsCollectionCreated,
	setPrevCollectionName,
	setCollectionDraftName,
}: CollectionFormProps) => {
	return (
		<div className="w-full py-1">
			<div className="px-1 py-3">
				{isCollectionCreated ? (
					<div className="text-center py-8">
						<h2 className="text-lg font-semibold mb-2">Collection Created</h2>
						<p className="text-muted-foreground">
							Add fields to your collection on the right side.
						</p>
					</div>
				) : (
					<div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-md border ">
						<div className="mb-6">
							<h2 className="text-lg font-semibold">Create New Collection</h2>
							<p className="text-sm text-muted-foreground">
								Define your collection name and type to get started.
							</p>
						</div>

						<ScrollArea className="h-80 pr-4 overflow-auto">
							<div className="space-y-6">
								<CollectionNameInput
									collectionNameInput={collectionNameInput}
									setCollectionNameInput={setCollectionNameInput}
									collectionNameValidation={collectionNameValidation}
									setCollectionNameValidation={setCollectionNameValidation}
									customPlural={customPlural}
									setCustomPlural={setCustomPlural}
								/>

								<CollectionTypeSelector
									collectionType={collectionType}
									setCollectionType={setCollectionType}
								/>

								<div className="pt-6 border-t">
									<Button
										className="w-full"
										disabled={!collectionNameValidation?.isValid}
										onClick={() => {
											if (collectionNameValidation?.isValid) {
												setPrevCollectionName(
													collectionNameValidation.displayName,
												);
												setCollectionDraftName(
													collectionNameValidation.displayName,
												);
												setIsCollectionCreated(true);
											}
										}}
									>
										Create Collection
									</Button>
								</div>
							</div>
						</ScrollArea>
					</div>
				)}
			</div>
		</div>
	);
};
