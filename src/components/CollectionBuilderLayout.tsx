import type { ReactNode } from "react";

/**
 * Layout component for the collection builder pages.
 * Provides a flexible flex container for displaying collection management content.
 *
 * @param children - The page-specific content to render
 * @returns A layout wrapper for collection builder pages
 */
const CollectionBuilderLayout = ({ children }: { children: ReactNode }) => {
	return <div className="flex h-full w-full">{children}</div>;
};

export default CollectionBuilderLayout;
