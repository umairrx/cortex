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
	actions,
}: {
	title: string;
	tagline: string;
	actions?: React.ReactNode;
}) => {
	return (
		<>
			<div className="flex items-center justify-between px-4 mb-4">
				<div className="space-y-1 min-w-0">
					<h4 className="text-lg font-semibold truncate">{title}</h4>
					<p className="text-xs text-muted-foreground truncate">{tagline}</p>
				</div>
				{actions && <div className="flex items-center">{actions}</div>}
			</div>
			<Separator />
		</>
	);
};

export default CollectionTypesHeader;
