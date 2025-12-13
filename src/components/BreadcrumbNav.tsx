import { Link, useLocation } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";

const routeLabels: Record<string, string> = {
	"/": "Dashboard",
	"/signin": "Sign In",
	"/signup": "Sign Up",
};

/**
 * A breadcrumb navigation component that displays the current page path.
 * Automatically generates breadcrumbs from the URL pathname and provides
 * clickable links to navigate back to parent routes.
 *
 * @returns A breadcrumb navigation bar with links and labels
 */
export default function BreadcrumbNav() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);

	const breadcrumbs = [
		{ path: "/", label: "Home" },
		...pathnames.map((pathname, index) => {
			const path = `/${pathnames.slice(0, index + 1).join("/")}`;
			return {
				path,
				label:
					routeLabels[path] ||
					pathname.charAt(0).toUpperCase() + pathname.slice(1),
			};
		}),
	];

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => (
					<div key={crumb.path} className="flex items-center">
						{index > 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							{index === breadcrumbs.length - 1 ? (
								<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link to={crumb.path}>{crumb.label}</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
