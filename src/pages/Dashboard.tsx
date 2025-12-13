import {
	Activity,
	ArrowUpRight,
	Database,
	FileText,
	Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCollections } from "@/contexts/CollectionsContext";

export default function Dashboard() {
	const { collections } = useCollections();

	return (
		<DashboardLayout>
			<PageHeader
				title="Dashboard"
				description="Overview of your content and collections."
			/>

			<div className="p-6 space-y-6">
				<div className="grid gap-3 grid-cols-1 md:grid-cols-3 ">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Collections
							</CardTitle>
							<Database className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{collections.length}</div>
							<p className="text-xs text-muted-foreground">
								Active content types
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Collection Types
							</CardTitle>
							<Layers className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{collections.filter((c) => c.type === "collection").length}
							</div>
							<p className="text-xs text-muted-foreground">Multi-item lists</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Single Types
							</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{collections.filter((c) => c.type === "single").length}
							</div>
							<p className="text-xs text-muted-foreground">
								Single page content
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>
								Your latest system interactions.
							</CardDescription>
						</CardHeader>
						<Separator />
						<CardContent>
							<ScrollArea className="h-[300px] w-full pr-4">
								<div className="space-y-8 p-4">
									{/* Placeholder for activity feed */}
									<div className="flex items-center">
										<Activity className="h-4 w-4 mr-4 text-muted-foreground" />
										<div className="ml-4 space-y-1">
											<p className="text-sm font-medium leading-none">
												System Ready
											</p>
											<p className="text-sm text-muted-foreground">
												Dashboard initialized.
											</p>
										</div>
										<div className="ml-auto font-medium text-xs text-muted-foreground">
											Just now
										</div>
									</div>
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Quick Access</CardTitle>
							<CardDescription>Jump to your collections.</CardDescription>
						</CardHeader>
						<Separator />
						<CardContent>
							<ScrollArea className="h-[300px] w-full">
								<div className="p-4 space-y-4">
									{collections.map((collection, index) => (
										<div key={collection.id}>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4">
													<div className="p-2 bg-muted rounded-full">
														{collection.type === "collection" ? (
															<Layers className="h-4 w-4 text-primary" />
														) : (
															<FileText className="h-4 w-4 text-primary" />
														)}
													</div>
													<div className="space-y-1">
														<p className="text-sm font-medium leading-none">
															{collection.name}
														</p>
														<p className="text-sm text-muted-foreground">
															{collection.type === "collection"
																? "Collection"
																: "Single Type"}
														</p>
													</div>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													asChild
												>
													<Link
														to={`/content-manager?collectionId=${collection.id}`}
													>
														<ArrowUpRight className="h-4 w-4" />
													</Link>
												</Button>
											</div>
											{index < collections.length - 1 && (
												<Separator className="my-4" />
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
}
