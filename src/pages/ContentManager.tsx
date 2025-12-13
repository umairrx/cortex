import {
	Briefcase,
	Database,
	Edit,
	FileText,
	Loader2,
	Newspaper,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollections } from "@/contexts/CollectionsContext";
import {
	type Item,
	useCreateItemMutation,
	useDeleteItemMutation,
	useItemsQuery,
	useUpdateItemMutation,
} from "@/hooks/tanstack/useItems";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getFieldType } from "@/types/fields";
import type { Collection } from "@/types/types";

export default function ContentManager() {
	const { collections } = useCollections();
	const [selectedCollection, setSelectedCollection] =
		useState<Collection | null>(null);

	const { data: contentItems = [], isLoading: isLoadingItems } = useItemsQuery(
		selectedCollection?.id || "",
		{ enabled: !!selectedCollection },
	);

	const createItemMutation = useCreateItemMutation(
		selectedCollection?.id || "",
	);
	const updateItemMutation = useUpdateItemMutation();
	const deleteItemMutation = useDeleteItemMutation();

	const [isEditing, setIsEditing] = useState(false);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [formData, setFormData] = useState<
		Record<string, string | string[] | number | boolean | null | undefined>
	>({});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleEditContent = (item: Item) => {
		setFormData(item.data);
		setErrors({});
		setEditingItem(item);
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setFormData({});
		setEditingItem(null);
		setErrors({});
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (selectedCollection) {
			selectedCollection.fields.forEach((field) => {
				const value = formData[field.field_name];
				const fieldDef = getFieldType(field.type);

				if (
					value === undefined ||
					value === null ||
					(typeof value === "string" && value.trim() === "")
				) {
					newErrors[field.field_name] = `${field.label} is required`;
				}

				if (fieldDef?.validation && value) {
					if (typeof value === "string") {
						if (
							fieldDef.validation.maxLength &&
							value.length > fieldDef.validation.maxLength
						) {
							newErrors[field.field_name] =
								`${field.label} must be ${fieldDef.validation.maxLength} characters or less`;
						}
						if (
							fieldDef.validation.minLength &&
							value.length < fieldDef.validation.minLength
						) {
							newErrors[field.field_name] =
								`${field.label} must be at least ${fieldDef.validation.minLength} characters`;
						}
					}
				}
			});
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSaveContent = async () => {
		if (!selectedCollection || !validateForm()) return;

		try {
			if (editingItem) {
				await updateItemMutation.mutateAsync({
					id: editingItem._id,
					data: formData,
				});
				toast.success("Content updated successfully");
			} else {
				await createItemMutation.mutateAsync(formData);
				toast.success("Content created successfully");
			}
			setIsEditing(false);
			setFormData({});
			setEditingItem(null);
		} catch (error) {
			console.error("Failed to save content", error);
			toast.error("Failed to save content");
		}
	};

	const [itemToDelete, setItemToDelete] = useState<string | null>(null);

	const handleDeleteContent = (itemId: string) => {
		setItemToDelete(itemId);
	};

	const confirmDelete = async () => {
		if (!itemToDelete) return;
		try {
			await deleteItemMutation.mutateAsync(itemToDelete);
			toast.success("Item deleted");
		} catch (error) {
			console.error("Failed to delete item", error);
			toast.error("Failed to delete item");
		} finally {
			setItemToDelete(null);
		}
	};

	const collectionTypes = collections.filter((c) => c.type === "collection");
	const singleTypes = collections.filter((c) => c.type === "single");

	const contentSidebar = [
		{
			title: "Collection Types",
			icon: <Database className="size-4" />,
			items: collectionTypes.map((c) => ({
				name: c.name,
				id: c.id,
				icon: <Newspaper className="size-4" />,
				collection: c,
			})),
		},
		{
			title: "Single Types",
			icon: <Database className="size-4" />,
			items: singleTypes.map((c) => ({
				name: c.name,
				id: c.id,
				icon: <Briefcase className="size-4" />,
				collection: c,
			})),
		},
	];

	return (
		<DashboardLayout>
			<PageHeader
				title="Content Manager"
				description="Create and manage your content items."
			/>
			<div className="w-full flex h-screen">
				<ScrollArea className="bg-sidebar py-4 pr-2 w-80 overflow-y-auto border-r">
					<div className="px-2 mb-6 sticky top-0 bg-sidebar pt-4 pb-2 z-10">
						<Link
							to="/collection-types-builder"
							className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
						>
							<Plus className="size-5" />
							<span className="font-medium text-sm">New Collection</span>
						</Link>
					</div>

					{collections.length === 0 ? (
						<EmptyState
							icon={Database}
							title="No Types Exist"
							description="Create your first collection type to get started."
							className="py-8"
						/>
					) : (
						contentSidebar
							.filter((section) => section.items.length > 0)
							.map((section) => (
								<div key={section.title} className="mb-8">
									<div className="flex items-center gap-2 border-b pb-3 mb-1 px-5">
										{section.icon}
										<h2 className="text-sm font-semibold">{section.title}</h2>
									</div>
									<ul className="space-y-1 ml-6">
										{section.items.map((item) => {
											return (
												<li key={item.name}>
													<button
														type="button"
														onClick={() => {
															setSelectedCollection(item.collection);
															setIsEditing(false);
														}}
														className={
															"w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left" +
															(selectedCollection?.id === item.id
																? " bg-accent"
																: "")
														}
													>
														<div className="flex items-center gap-2">
															{item.icon}
															<span className="text-sm">{item.name}</span>
														</div>
													</button>
												</li>
											);
										})}
									</ul>
								</div>
							))
					)}
				</ScrollArea>

				<div className="flex-1 p-6">
					{selectedCollection ? (
						<div className="w-full min-h-0">
							<div className="mb-6">
								<div className="flex items-center justify-between">
									<div>
										<h1 className="text-2xl font-bold">
											{selectedCollection.name}
										</h1>
										<p className="text-muted-foreground">
											{selectedCollection.type === "collection"
												? "Manage multiple content entries"
												: "Manage single content entry"}
										</p>
									</div>
									{!isEditing && (
										<Button
											asChild
											disabled={
												selectedCollection.type === "single" &&
												contentItems.length > 0
											}
										>
											<Link
												to={`/content-manager/${selectedCollection.id}/create`}
											>
												<Plus className="h-4 w-4 mr-2" />
												{selectedCollection.type === "collection"
													? "Add Entry"
													: "Create Content"}
											</Link>
										</Button>
									)}
								</div>
							</div>

							{isEditing ? (
								<Card>
									<ScrollArea className="h-[calc(100vh-200px)] min-h-0">
										<CardContent>
											<div className="mb-6">
												<h2 className="text-lg font-semibold">
													{editingItem ? "Edit" : "Create"} Content
												</h2>
												<p className="text-sm text-muted-foreground">
													Fill in the fields below to{" "}
													{editingItem ? "update" : "create"} your content.
												</p>
											</div>
											<div className="space-y-6">
												{selectedCollection.fields.map((field) => (
													<FieldRenderer
														key={field.field_name}
														field={field}
														value={formData[field.field_name]}
														onChange={(value) =>
															setFormData((prev) => ({
																...prev,
																[field.field_name]: value,
															}))
														}
														error={errors[field.field_name]}
													/>
												))}
											</div>
											<div className="flex gap-3 py-3 justify-end">
												<Button variant="outline" onClick={handleCancelEdit}>
													Cancel
												</Button>
												<Button
													onClick={handleSaveContent}
													disabled={
														createItemMutation.isPending ||
														updateItemMutation.isPending
													}
												>
													{(createItemMutation.isPending ||
														updateItemMutation.isPending) && (
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													)}
													{editingItem ? "Update" : "Create"} Content
												</Button>
											</div>
										</CardContent>
									</ScrollArea>
								</Card>
							) : isLoadingItems ? (
								<div className="flex items-center justify-center p-12">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
								</div>
							) : selectedCollection.type === "collection" ? (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">Content Entries</h2>
									{contentItems.length === 0 ? (
										<Card>
											<CardContent className="h-64">
												<EmptyState
													icon={FileText}
													title="No Content Yet"
													description="Create your first content entry for this collection."
												/>
											</CardContent>
										</Card>
									) : (
										<div className="space-y-2">
											{contentItems.map((item) => (
												<Card key={item._id}>
													<CardContent className="p-4">
														<div className="flex items-center justify-between">
															<span className="font-medium">
																{(() => {
																	const firstField =
																		selectedCollection.fields[0];
																	const val = item.data[firstField?.field_name];
																	if (!val) return "Untitled";
																	if (typeof val === "string") return val;
																	if (typeof val === "number")
																		return String(val);
																	return "Content Item";
																})()}
															</span>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleEditContent(item)}
																>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleDeleteContent(item._id)}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</div>
													</CardContent>
												</Card>
											))}
										</div>
									)}
								</div>
							) : (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">Content Entry</h2>
									{contentItems.length === 0 ? (
										<Card>
											<CardContent className="h-64">
												<EmptyState
													icon={FileText}
													title="No Content Yet"
													description="Create content for this single type."
												/>
											</CardContent>
										</Card>
									) : (
										<Card>
											<CardContent className="p-6">
												<div className="flex justify-between items-center mb-4">
													<h3 className="text-lg font-medium">
														Current Content
													</h3>
													<Button
														variant="outline"
														onClick={() => handleEditContent(contentItems[0])}
													>
														<Edit className="h-4 w-4 mr-2" />
														Edit
													</Button>
												</div>
												<div className="space-y-2">
													{selectedCollection.fields.map((field) => (
														<div key={field.field_name}>
															<label
																htmlFor={`field-display-${field.field_name}`}
																className="text-sm font-medium text-muted-foreground"
															>
																{field.label}
															</label>
															<p
																id={`field-display-${field.field_name}`}
																className="text-sm"
															>
																{(() => {
																	const val =
																		contentItems[0].data[field.field_name];
																	if (val === undefined || val === null)
																		return "Not set";
																	if (typeof val === "string") return val;
																	if (typeof val === "number")
																		return String(val);
																	if (Array.isArray(val))
																		return `[${val.length} items]`;
																	return JSON.stringify(val);
																})()}
															</p>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									)}
								</div>
							)}
						</div>
					) : (
						<EmptyState
							icon={Database}
							title="No Collection Selected"
							description="Select a collection from the sidebar to manage content."
						/>
					)}
				</div>
			</div>
			<ConfirmDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				title="Delete Item"
				description="Are you sure you want to delete this item? This action cannot be undone."
				confirmLabel="Delete"
				onConfirm={confirmDelete}
				isLoading={deleteItemMutation.isPending}
				variant="destructive"
			/>
		</DashboardLayout>
	);
}
