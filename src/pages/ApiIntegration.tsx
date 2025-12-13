import { zodResolver } from "@hookform/resolvers/zod";
import { Cloud, Database } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import DashboardLayout from "@/components/DashboardLayout";
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

type DatabaseType = "mongodb" | "supabase";

interface DatabaseConnection {
	id: string;
	name: string;
	type: DatabaseType;
	uri?: string;
	url?: string;
	apiKey?: string;
}

const formSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		type: z.enum(["mongodb", "supabase"]),
		uri: z.string().optional(),
		url: z.string().optional(),
		apiKey: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.type === "mongodb") {
				return data.uri && data.uri.length > 0;
			} else if (data.type === "supabase") {
				return (
					data.url &&
					data.apiKey &&
					data.url.length > 0 &&
					data.apiKey.length > 0
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

/**
 * API Integration page component for managing database connections.
 * Allows users to configure and manage connections to MongoDB and Supabase databases.
 * Provides interface for adding, viewing, and managing connection settings.
 *
 * @returns The API integration page with connection management tools
 */
export default function ApiIntegration() {
	const [connections, setConnections] = useState<DatabaseConnection[]>([]);

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

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		const newConnection: DatabaseConnection = {
			id: Date.now().toString(),
			name: values.name,
			type: values.type,
			uri: values.type === "mongodb" ? values.uri : undefined,
			url: values.type === "supabase" ? values.url : undefined,
			apiKey: values.type === "supabase" ? values.apiKey : undefined,
		};
		setConnections([...connections, newConnection]);
		form.reset();
	};

	return (
		<DashboardLayout>
			<PageHeader
				title="API Integration"
				description="Manage and configure API integrations for your CMS."
			/>
			<ScrollArea className="h-[calc(100vh-200px)]">
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card className="w-full">
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
																<SelectItem value="mongodb">MongoDB</SelectItem>
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
										{selectedType === "mongodb" && (
											<FormField
												control={form.control}
												name="uri"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Connection URI</FormLabel>
														<FormControl>
															<Input
																placeholder="mongodb://username:password@host:port/database"
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
											</>
										)}
										<Button type="submit">Add Connection</Button>
									</form>
								</Form>
							</CardContent>
						</Card>

						<Card className="w-full">
							<CardHeader>
								<CardTitle>Existing Connections</CardTitle>
								<CardDescription>
									Your configured database connections.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{connections.length === 0 ? (
									<p className="text-muted-foreground">
										No connections added yet.
									</p>
								) : (
									<div className="space-y-4">
										{connections.map((conn) => (
											<div
												key={conn.id}
												className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
											>
												<div className="flex items-start gap-3 flex-1">
													<div className="mt-0.5">
														{conn.type === "mongodb" ? (
															<Database className="h-5 w-5 text-muted-foreground" />
														) : (
															<Cloud className="h-5 w-5 text-muted-foreground" />
														)}
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<h4 className="font-medium text-sm">
																{conn.name}
															</h4>
															<Badge variant="secondary" className="text-xs">
																{conn.type}
															</Badge>
														</div>
														{conn.type === "mongodb" && conn.uri && (
															<p className="text-xs text-muted-foreground truncate">
																URI:{" "}
																{conn.uri.replace(/:\/\/.*@/, "://***:***@")}
															</p>
														)}
														{conn.type === "supabase" && conn.url && (
															<p className="text-xs text-muted-foreground truncate">
																URL: {conn.url}
															</p>
														)}
													</div>
												</div>
												<Button variant="outline" size="sm" className="ml-4">
													Test Connection
												</Button>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</ScrollArea>
		</DashboardLayout>
	);
}
