import { Outlet } from "react-router-dom";

/**
 * Base layout component that provides the main container structure for all pages.
 * Renders a full-height container with background styling and routes child components
 * through the Outlet component.
 *
 * @returns A layout wrapper containing the page content outlet
 */
export default function Layout() {
	return (
		<div className="min-h-screen bg-background">
			<main>
				<Outlet />
			</main>
		</div>
	);
}
