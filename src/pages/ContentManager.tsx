import {
	Briefcase,
	Database,
	Edit,
	FileText,
	Newspaper,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollections } from "@/contexts/CollectionsContext";

interface ContentItem {
	id: string;
	collectionId: string;
	data: Record<string, string | string[] | number | boolean | null | undefined>;
	createdAt: string;
	updatedAt: string;
}

interface Collection {
	id: string;
	name: string;
	type: "collection" | "single";
	fields: Array<{ field_name: string; type: string; label: string }>;
}

export default function ContentManager() {
	const { collections } = useCollections();
	const [selectedCollection, setSelectedCollection] =
		useState<Collection | null>(null);
	const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
		const stored = localStorage.getItem("contentItems");
		return stored ? JSON.parse(stored) : [];
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
	const [formData, setFormData] = useState<
		Record<string, string | string[] | number | boolean | null | undefined>
	>({});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const saveContentItems = (items: ContentItem[]) => {
		setContentItems(items);
		localStorage.setItem("contentItems", JSON.stringify(items));
	};

	const handleCreateContent = () => {
		setFormData({});
		setErrors({});
		setEditingItem(null);
		setIsEditing(true);
	};

	const handleEditContent = (item: ContentItem) => {
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
				if (!value || (typeof value === "string" && value.trim() === "")) {
					newErrors[field.field_name] = `${field.field_name} is required`;
				}
			});
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSaveContent = () => {
		if (!selectedCollection || !validateForm()) return;

		const now = new Date().toISOString();
		const contentItem: ContentItem = {
			id: editingItem?.id || Date.now().toString(),
			collectionId: selectedCollection.id,
			data: formData,
			createdAt: editingItem?.createdAt || now,
			updatedAt: now,
		};

		const updatedItems = editingItem
			? contentItems.map((item) =>
					item.id === editingItem.id ? contentItem : item,
				)
			: [...contentItems, contentItem];

		saveContentItems(updatedItems);
		setIsEditing(false);
		setFormData({});
		setEditingItem(null);
	};

	const handleDeleteContent = (itemId: string) => {
		const updatedItems = contentItems.filter((item) => item.id !== itemId);
		saveContentItems(updatedItems);
	};

	const getCollectionContent = (collectionId: string) => {
		return contentItems.filter((item) => item.collectionId === collectionId);
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
				<ScrollArea className="bg-sidebar py-4 pr-2 w-80 overflow-y-auto">
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
											const content = getCollectionContent(item.id);
											return (
												<li key={item.name}>
													<button
														type="button"
														onClick={() => {
															setSelectedCollection(item.collection);
															setIsEditing(false);
															if (
																item.collection.type === "single" &&
																content.length > 0
															) {
																handleEditContent(content[0]);
															}
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
														<span className="text-xs text-muted-foreground">
															{content.length}
														</span>
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
						<div className="max-w-4xl">
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
										<Button onClick={handleCreateContent}>
											<Plus className="h-4 w-4 mr-2" />
											{selectedCollection.type === "collection"
												? "Add Entry"
												: "Create Content"}
										</Button>
									)}
								</div>
							</div>

							{isEditing ? (
								<Card>
									<CardContent className="p-6">
										<div className="mb-6">
											<h2 className="text-lg font-semibold">
												{editingItem ? "Edit" : "Create"} Content
											</h2>
											<p className="text-sm text-muted-foreground">
												Fill in the fields below to{" "}
												{editingItem ? "update" : "create"} your content.
											</p>
										</div>

										<ScrollArea className="max-h-[60vh] pr-4">
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
										</ScrollArea>

										<div className="flex justify-end gap-3 mt-6 pt-6 border-t">
											<Button variant="outline" onClick={handleCancelEdit}>
												Cancel
											</Button>
											<Button onClick={handleSaveContent}>
												{editingItem ? "Update" : "Create"} Content
											</Button>
										</div>
									</CardContent>
								</Card>
							) : selectedCollection.type === "collection" ? (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">Content Entries</h2>
									{getCollectionContent(selectedCollection.id).length === 0 ? (
										<Card>
											<CardContent className="flex flex-col items-center justify-center py-12">
												<FileText className="h-12 w-12 text-muted-foreground mb-4" />
												<h3 className="text-lg font-medium text-muted-foreground mb-2">
													No Content Yet
												</h3>
												<p className="text-sm text-muted-foreground text-center">
													Create your first content entry for this collection.
												</p>
											</CardContent>
										</Card>
									) : (
										<div className="space-y-2">
											{getCollectionContent(selectedCollection.id).map(
												(item) => (
													<Card key={item.id}>
														<CardContent className="p-4">
															<div className="flex items-center justify-between">
																<span className="font-medium">
																	{String(
																		item.data[
																			selectedCollection.fields[0]?.field_name
																		] || "Untitled",
																	)}
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
																		onClick={() => handleDeleteContent(item.id)}
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</div>
															</div>
														</CardContent>
													</Card>
												),
											)}
										</div>
									)}
								</div>
							) : (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">Content Entry</h2>
									{getCollectionContent(selectedCollection.id).length === 0 ? (
										<Card>
											<CardContent className="p-6">
												<div className="text-center mb-4">
													<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
													<h3 className="text-lg font-medium text-muted-foreground mb-2">
														No Content Yet
													</h3>
													<p className="text-sm text-muted-foreground">
														Create content for this single type.
													</p>
												</div>
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
														onClick={() =>
															handleEditContent(
																getCollectionContent(selectedCollection.id)[0],
															)
														}
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
																{String(
																	getCollectionContent(selectedCollection.id)[0]
																		.data[field.field_name] || "Not set",
																)}
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
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<Database className="size-16 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium text-muted-foreground mb-2">
									No Collection Selected
								</h3>
								<p className="text-sm text-muted-foreground">
									Select a collection from the sidebar to manage content.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}
