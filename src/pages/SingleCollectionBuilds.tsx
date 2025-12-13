import { Briefcase, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCollections } from "@/contexts/CollectionsContext";
import CollectionTypesHeader from "./CollectionTypesHeader";

/**
 * Page component for managing single-type collections.
 * Displays the fields of a single-type collection and provides delete functionality.
 * Single-type collections contain only one entry with a predefined structure.
 *
 * @returns The single collection management page
 */
const SingleCollectionBuilds = () => {
	const { id } = useParams<{ id: string }>();
	const { collections, deleteCollection } = useCollections();
	const navigate = useNavigate();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const collection = id ? collections.find((c) => c.id === id) : null;

	if (!collection) {
		return (
			<EmptyState
				icon={Briefcase}
				title="Collection Not Found"
				description="The collection you're looking for doesn't exist or has been deleted."
			/>
		);
	}

	return (
		<TooltipProvider>
			<div className="flex w-full justify-between">
				<div className="w-full py-3">
					<CollectionTypesHeader
						title={`${collection.name} (Single Type)`}
						tagline="This is a single entry collection"
						actions={
							<Button
								variant="destructive"
								size="sm"
								onClick={() => setShowDeleteDialog(true)}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete Collection
							</Button>
						}
					/>
					<div className="px-4 py-3 space-y-4">
						<div className="text-sm text-muted-foreground mb-4">
							Single types contain one entry with the following fields:
						</div>
						{collection.fields.length === 0 ? (
							<div className="text-sm text-muted-foreground">
								No fields configured.
							</div>
						) : (
							<div className="space-y-3">
								{collection.fields.map((field) => (
									<div
										key={field.field_name}
										className="flex items-center justify-between p-3 border rounded bg-muted/50"
									>
										<div>
											<div className="text-sm font-medium">
												{field.field_name}
											</div>
											<div className="text-xs text-muted-foreground">
												{field.label} - {field.type}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
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
		</TooltipProvider>
	);
};

export default SingleCollectionBuilds;
