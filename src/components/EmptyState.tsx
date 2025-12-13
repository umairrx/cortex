import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

/**
 * Reusable empty state component for displaying when no content is available.
 * Provides a consistent design pattern with optional icon, title, description, and action button.
 *
 * @param icon - Optional Lucide icon component to display
 * @param title - Main heading text
 * @param description - Optional descriptive text
 * @param action - Optional action button configuration
 * @param className - Additional CSS classes
 */
export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex justify-center items-center w-full h-full",
				className,
			)}
		>
			<div className="text-center space-y-4 max-w-md">
				{Icon && (
					<div className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-16 w-16 mx-auto">
						<Icon className="h-8 w-8" />
					</div>
				)}
				<div className="space-y-2">
					<h3 className="text-xl font-semibold">{title}</h3>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
				{action && (
					<Button onClick={action.onClick} className="mt-4">
						{action.label}
					</Button>
				)}
			</div>
		</div>
	);
}
