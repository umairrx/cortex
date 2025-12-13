import { Briefcase, Database, Newspaper, PlusCircle } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import CollectionBuilderLayout from "@/components/CollectionBuilderLayout";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollections } from "@/contexts/CollectionsContext";

/**
 * Collection Types Builder page component for defining and managing collection types.
 * Allows users to create custom collection structures and fields.
 *
 * @returns The collection types builder page with creation tools
 */
export default function CollectionTypesBuilder() {
	const { collections } = useCollections();

	const collectionSidebar = [
		{
			title: "Collection Types",
			icon: <Database className="size-4" />,
			items: collections
				.filter((c) => c.type === "collection")
				.map((c) => ({
					name: c.name,
					link: c.id,
					icon: <Newspaper className="size-4" />,
				})),
		},
		{
			title: "Single Types",
			icon: <Database className="size-4" />,
			items: collections
				.filter((c) => c.type === "single")
				.map((c) => ({
					name: c.name,
					link: c.id,
					icon: <Briefcase className="size-4" />,
				})),
		},
	];

	const location = window.location.pathname;

	return (
		<DashboardLayout>
			<PageHeader
				title="Collection Types Builder"
				description="Build and manage your collection types here."
			/>
			<div className="w-full flex h-screen">
				<ScrollArea className="bg-sidebar py-4 pr-2 w-80 overflow-y-auto border-r">
					<div className="px-2 mb-6 sticky top-0 bg-sidebar pt-4 pb-2 z-10">
						<Link
							to="/collection-types-builder"
							className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
						>
							<PlusCircle className="size-5" />
							<span className="font-medium text-sm">New Collection</span>
						</Link>
					</div>
					{collections.length === 0 ? (
						<div className="px-5 py-8 text-center">
							<Database className="size-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-sm font-medium text-muted-foreground mb-2">
								No Types Exist
							</h3>
							<p className="text-xs text-muted-foreground">
								Create your first collection type to get started.
							</p>
						</div>
					) : (
						collectionSidebar
							.filter((section) => section.items.length > 0)
							.map((section) => (
								<div key={section.title} className="mb-8">
									<div className="flex items-center gap-2 border-b pb-3 mb-1 px-5">
										{section.icon}
										<h2 className="text-sm font-semibold">{section.title}</h2>
									</div>

									<ul className="space-y-1 ml-6">
										{section.items.map((item) => (
											<li key={item.name}>
												<Link
													to={item.link}
													className={
														"flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors" +
														(location ===
														`/collection-types-builder/${item.link}`
															? " bg-accent"
															: "")
													}
												>
													{item.icon}
													<span className="text-sm">{item.name}</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							))
					)}
				</ScrollArea>
				<CollectionBuilderLayout>
					<Outlet />
				</CollectionBuilderLayout>
			</div>
		</DashboardLayout>
	);
}
