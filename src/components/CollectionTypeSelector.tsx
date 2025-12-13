import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CollectionTypeSelectorProps {
	collectionType: "collection" | "single";
	setCollectionType: (type: "collection" | "single") => void;
}

/**
 * Component for selecting collection type (collection vs single)
 */
export const CollectionTypeSelector = ({
	collectionType,
	setCollectionType,
}: CollectionTypeSelectorProps) => {
	return (
		<div className="space-y-3">
			<Label>Collection Type</Label>
			<RadioGroup
				value={collectionType}
				onValueChange={(value) =>
					setCollectionType(value as "collection" | "single")
				}
				className="grid grid-cols-1 gap-3"
			>
				<button
					type="button"
					className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer w-full text-left"
					onClick={() => setCollectionType("collection")}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setCollectionType("collection");
						}
					}}
					tabIndex={0}
					aria-pressed={collectionType === "collection"}
				>
					<RadioGroupItem value="collection" id="collection" />
					<div className="flex-1">
						<Label htmlFor="collection" className="font-medium cursor-pointer">
							Collection Types
						</Label>
						<p className="text-sm text-muted-foreground">
							Multiple entries with the same structure
						</p>
					</div>
				</button>
				<button
					type="button"
					className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer w-full text-left"
					onClick={() => setCollectionType("single")}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setCollectionType("single");
						}
					}}
					tabIndex={0}
					aria-pressed={collectionType === "single"}
				>
					<RadioGroupItem value="single" id="single" />
					<div className="flex-1">
						<Label htmlFor="single" className="font-medium cursor-pointer">
							Single Types
						</Label>
						<p className="text-sm text-muted-foreground">
							Single entry with unique content
						</p>
					</div>
				</button>
			</RadioGroup>
		</div>
	);
};
