import { Label } from "@/components/ui/label";

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
			<div className="grid grid-cols-1 gap-3">
				<button
					type="button"
					className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer w-full text-left ${
						collectionType === "collection" ? "bg-accent border-primary" : ""
					}`}
					onClick={() => setCollectionType("collection")}
				>
					<div className="w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center">
						{collectionType === "collection" && (
							<div className="w-2 h-2 bg-primary rounded-full" />
						)}
					</div>
					<div className="flex-1">
						<Label className="font-medium cursor-pointer">
							Collection Types
						</Label>
						<p className="text-sm text-muted-foreground">
							Multiple entries with the same structure
						</p>
					</div>
				</button>
				<button
					type="button"
					className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer w-full text-left ${
						collectionType === "single" ? "bg-accent border-primary" : ""
					}`}
					onClick={() => setCollectionType("single")}
				>
					<div className="w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center">
						{collectionType === "single" && (
							<div className="w-2 h-2 bg-primary rounded-full" />
						)}
					</div>
					<div className="flex-1">
						<Label className="font-medium cursor-pointer">Single Types</Label>
						<p className="text-sm text-muted-foreground">
							Single entry with unique content
						</p>
					</div>
				</button>
			</div>
		</div>
	);
};
