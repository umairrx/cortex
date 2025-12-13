interface PageHeaderProps {
	title: string;
	description: string;
}

/**
 * A reusable header component for dashboard pages that displays
 * a title and description with clean, modern styling.
 *
 * @param title - The main heading text to display
 * @param description - The subtitle or description text
 * @returns A styled header element with title and description
 */
export default function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-6 pb-4">
			<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
			<p className="text-muted-foreground mt-2">{description}</p>
		</div>
	);
}
