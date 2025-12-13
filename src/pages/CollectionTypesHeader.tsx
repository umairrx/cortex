import { Separator } from "@/components/ui/separator";

/**
 * Header component for collection builder pages.
 * Displays the collection name and description with a visual separator.
 *
 * @param title - The main heading text
 * @param tagline - The subtitle or description text
 * @returns A styled header component for collection management
 */
const CollectionTypesHeader = ({
	title,
	tagline,
}: {
	title: string;
	tagline: string;
}) => {
	return (
		<>
			<div className="space-y-1 px-4 mb-4">
				<h4>{title}</h4>
				<p className="text-xs text-muted-foreground">{tagline}</p>
			</div>
			<Separator />
		</>
	);
};

export default CollectionTypesHeader;
