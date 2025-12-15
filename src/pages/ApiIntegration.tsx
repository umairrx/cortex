import { zodResolver } from "@hookform/resolvers/zod";
import { Cloud, Database } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/layouts/DashboardLayout";

const formSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		type: z.enum(["mongodb", "supabase", "postgres"]),
		uri: z.string().optional(),
		url: z.string().optional(),
		apiKey: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.type === "mongodb") {
				return data.uri && data.uri.length > 0;
			} else if (data.type === "postgres") {
				return data.uri && data.uri.length > 0;
			} else if (data.type === "supabase") {
				return (
					(data.url &&
						data.apiKey &&
						data.url.length > 0 &&
						data.apiKey.length > 0) ||
					(data.uri && data.uri.length > 0)
				);
			}
			return true;
		},
		{
			message:
				"Please provide the required fields for the selected database type",
			path: ["type"],
		},
	);

import { toast } from "sonner";
import { useCollections } from "../contexts/CollectionsContext";
/**
 * API Integration page component for managing database connections.
 * Allows users to configure and manage connections to MongoDB and Supabase databases.
 * Provides interface for adding, viewing, and managing connection settings.
 *
 * @returns The API integration page with connection management tools
 */
import { useIntegrations } from "../hooks/useIntegrations";

export default function ApiIntegration() {
	const {
		integrations: connections,
		createIntegration,
		deleteIntegration,
		testConnection,
		introspectConnection,
		isCreating,
		isDeleting,
		isTesting,
		isIntrospecting,
		getTableSchema,
	} = useIntegrations();

	const [introspectionOpen, setIntrospectionOpen] = React.useState(false);
	const [discoveredTables, setDiscoveredTables] = React.useState<string[]>([]);
	const [activeConnectionName, setActiveConnectionName] = React.useState("");

	const handleIntrospect = async (id: string, name: string) => {
		try {
			const result = await introspectConnection(id);
			if (result?.tables) {
				setDiscoveredTables(result.tables);
				setActiveConnectionName(name);
				setIntrospectionOpen(true);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const { addCollection } = useCollections();

	const [enablingTable, setEnablingTable] = React.useState<string | null>(null);

	const handleEnableCollection = async (tableName: string) => {
		try {
			setEnablingTable(tableName);

			const schema = await getTableSchema({
				id: connections.find((c) => c.name === activeConnectionName)?._id ?? "",
				tableName,
			});

			const fields = Object.entries(schema)
				.map(([key, type]) => {
					let cortexType = "text";
					if (key === "_id") return null;
					if (type === "number") cortexType = "number";
					if (type === "date") cortexType = "date";
					if (type === "boolean") cortexType = "boolean";
					if (type === "array" || type === "object") cortexType = "json";

					return {
						field_name: key,
						label: key.charAt(0).toUpperCase() + key.slice(1),
						type: cortexType,
					};
				})
				.filter(Boolean) as {
				field_name: string;
				label: string;
				type: string;
			}[];

			await addCollection({
				id: tableName,
				name: tableName,
				singular: tableName,
				plural: tableName,
				type: "collection",
				fields,
				integrationId: connections.find((c) => c.name === activeConnectionName)
					?._id,
				externalTableName: tableName,
			});

			toast.success(`Collection '${tableName}' active!`);
		} catch (error) {
			console.error("Failed to enable collection", error);
			toast.error("Failed to enable collection");
		} finally {
			setEnablingTable(null);
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: "mongodb",
			uri: "",
			url: "",
			apiKey: "",
		},
	});

	const selectedType = form.watch("type");

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const config: Record<string, string> = {};
		if (values.type === "mongodb") config.uri = values.uri ?? "";
		if (values.type === "postgres") config.uri = values.uri ?? "";
		if (values.type === "supabase") {
			config.url = values.url ?? "";
			config.apiKey = values.apiKey ?? "";
			if (values.uri) config.connectionString = values.uri;
		}

		try {
			await createIntegration({
				name: values.name,
				type: values.type,
				config,
			});
			form.reset();
		} catch (error) {
			console.error("Submit error", error);
		}
	};

	return (
		<DashboardLayout>
			<PageHeader
				title="API Integration"
				description="Manage and configure API integrations for your CMS."
			/>
			<ScrollArea className="h-[calc(100vh-200px)] min-h-0 overflow-auto">
				<div className="p-6">
					<div className="max-w-4xl mx-auto space-y-6">
						{connections.length > 0 ? (
							<Card className="border-green-500/20 bg-green-500/5">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<CardTitle className="text-green-600 flex items-center gap-2">
												<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
												Active Connection
											</CardTitle>
											<CardDescription>
												Your system is currently connected to an external
												database.
											</CardDescription>
										</div>
										<Badge variant="outline" className="bg-background">
											{connections[0].type.toUpperCase()}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between p-4 bg-background border rounded-lg">
										<div className="flex items-center gap-4">
											<div className="p-2 bg-secondary rounded-md">
												{connections[0].type === "mongodb" ? (
													<Database className="h-6 w-6" />
												) : connections[0].type === "postgres" ? (
													<Database className="h-6 w-6 text-blue-500" />
												) : (
													<Cloud className="h-6 w-6" />
												)}
											</div>
											<div>
												<h3 className="font-semibold">{connections[0].name}</h3>
												<p className="text-xs text-muted-foreground font-mono mt-1">
													{connections[0].config.uri
														? (connections[0].config.uri as string).replace(
																/:\/\/.*@/,
																"://***:***@",
															)
														: connections[0].config.connectionString
															? (
																	connections[0].config
																		.connectionString as string
																).replace(/:\/\/.*@/, "://***:***@")
															: (connections[0].config.url as string)}
												</p>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleIntrospect(
														connections[0]._id,
														connections[0].name,
													)
												}
												disabled={isIntrospecting}
											>
												{isIntrospecting ? "Scanning..." : "Introspect"}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => testConnection(connections[0]._id)}
												disabled={isTesting}
											>
												Test Connectivity
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => {
													if (
														confirm(
															"Are you sure? This will disconnect your external database.",
														)
													)
														deleteIntegration(connections[0]._id);
												}}
												disabled={isDeleting}
											>
												Disconnect
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<CardTitle>Add Database Connection</CardTitle>
									<CardDescription>
										Connect your CMS to external databases. Currently supports
										MongoDB and Supabase.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-4"
										>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name="name"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Connection Name</FormLabel>
															<FormControl>
																<Input
																	placeholder="My Database"
																	{...field}
																	className="w-full"
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="type"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Database Type</FormLabel>
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Select database type" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value="mongodb">
																		MongoDB
																	</SelectItem>
																	<SelectItem value="postgres">
																		PostgreSQL
																	</SelectItem>
																	<SelectItem value="supabase">
																		Supabase
																	</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											{(selectedType === "mongodb" ||
												selectedType === "postgres") && (
												<FormField
													control={form.control}
													name="uri"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																{selectedType === "postgres"
																	? "Connection String"
																	: "Connection URI"}
															</FormLabel>
															<FormControl>
																<Input
																	placeholder={
																		selectedType === "postgres"
																			? "postgresql://user:password@host:5432/db"
																			: "mongodb://username:password@host:port/database"
																	}
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											)}
											{selectedType === "supabase" && (
												<>
													<FormField
														control={form.control}
														name="url"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Supabase URL</FormLabel>
																<FormControl>
																	<Input
																		placeholder="https://your-project.supabase.co"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="apiKey"
														render={({ field }) => (
															<FormItem>
																<FormLabel>API Key</FormLabel>
																<FormControl>
																	<Input
																		type="password"
																		placeholder="Your Supabase API key"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="relative">
														<div className="absolute inset-0 flex items-center">
															<span className="w-full border-t" />
														</div>
														<div className="relative flex justify-center text-xs uppercase">
															<span className="bg-background px-2 text-muted-foreground">
																Or Use Connection String (For Full Access)
															</span>
														</div>
													</div>
													<FormField
														control={form.control}
														name="uri"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Connection String (Optional but Recommended)
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</>
											)}
											<Button type="submit" disabled={isCreating}>
												{isCreating ? "Adding..." : "Add Connection"}
											</Button>
										</form>
									</Form>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</ScrollArea>

			<Dialog open={introspectionOpen} onOpenChange={setIntrospectionOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Discovered Collections</DialogTitle>
						<DialogDescription>
							Found {discoveredTables.length} collections in{" "}
							{activeConnectionName}.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						{discoveredTables.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No collections found.
							</p>
						) : (
							<div className="grid gap-2">
								{discoveredTables.map((table) => (
									<div
										key={table}
										className="flex items-center justify-between p-2 border rounded hover:bg-muted"
									>
										<span className="text-sm font-medium">{table}</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEnableCollection(table)}
											disabled={enablingTable === table}
										>
											{enablingTable === table ? "Enabling..." : "Enable"}
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</DashboardLayout>
	);
}
