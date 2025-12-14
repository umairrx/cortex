import { ArrowLeft, Database, HardDrive, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/contexts/CollectionsContext";
import { useCreateItemMutation } from "@/hooks/tanstack/useItems";
import { useIntegrations } from "@/hooks/useIntegrations";
import { getFieldType } from "@/types/fields";

export default function ContentCreate() {
	const { collectionId } = useParams<{ collectionId: string }>();
	const { collections } = useCollections();
	const { integrations } = useIntegrations();
	const navigate = useNavigate();

	const collection = collections.find((c) => c.id === collectionId);

	const activeIntegration = collection?.integrationId
		? integrations.find((i) => i._id === collection.integrationId)
		: null;

	const createItemMutation = useCreateItemMutation(collectionId || "");

	const [formData, setFormData] = useState<
		Record<string, string | string[] | number | boolean | null | undefined>
	>({});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (collection) {
			collection.fields.forEach((field) => {
				const value = formData[field.field_name];
				const fieldDef = getFieldType(field.type);

				if (field.required) {
					if (
						value === undefined ||
						value === null ||
						(typeof value === "string" && value.trim() === "")
					) {
						newErrors[field.field_name] = `${field.label} is required`;
					}
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

	const handleSave = async () => {
		if (!collection || !validateForm()) return;

		try {
			await createItemMutation.mutateAsync(formData);
			toast.success(
				`Content created in ${activeIntegration ? activeIntegration.name : "Internal DB"}`,
			);
			navigate(`/content-manager?collectionId=${collectionId}`);
		} catch (error) {
			console.error("Failed to save content", error);
			toast.error("Failed to save content");
		}
	};

	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [showSaveDialog, setShowSaveDialog] = useState(false);

	if (!collection) {
		return (
			<div className="flex items-center justify-center p-12">
				<p>Collection not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Header */}
			<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
				<div className="container flex h-16 items-center justify-between py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() =>
								navigate(`/content-manager?collectionId=${collectionId}`)
							}
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<h1 className="text-lg font-semibold leading-none tracking-tight">
									Create {collection.singular}
								</h1>
								{activeIntegration ? (
									<Badge
										variant="outline"
										className="text-xs gap-1 border-blue-500/30 bg-blue-50 text-blue-700"
									>
										<Database className="h-3 w-3" />
										{activeIntegration.name}
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="text-xs gap-1 text-muted-foreground"
									>
										<HardDrive className="h-3 w-3" />
										Internal DB
									</Badge>
								)}
							</div>
							<p className="text-sm text-muted-foreground">
								Add a new entry to {collection.name}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={() => setShowCancelDialog(true)}>
							Cancel
						</Button>

						<Button
							onClick={() => setShowSaveDialog(true)}
							disabled={createItemMutation.isPending}
						>
							{createItemMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							<Save className="mr-2 h-4 w-4" />
							Save Entry
						</Button>
					</div>
				</div>
			</header>

			<ConfirmDialog
				open={showCancelDialog}
				onOpenChange={setShowCancelDialog}
				title="Are you sure?"
				description="You have unsaved changes. Are you sure you want to cancel?"
				confirmLabel="Yes, Cancel"
				cancelLabel="Continue Editing"
				onConfirm={() => navigate(-1)}
				variant="destructive"
			/>

			<ConfirmDialog
				open={showSaveDialog}
				onOpenChange={setShowSaveDialog}
				title="Save Entry"
				description="Are you sure you want to save this new entry?"
				confirmLabel="Save Entry"
				onConfirm={handleSave}
				isLoading={createItemMutation.isPending}
			/>

			{/* Main Content */}
			<main className="flex-1 container py-8 max-w-3xl mx-auto">
				<div className="space-y-6 bg-card rounded-lg border p-6 shadow-sm">
					{collection.fields.map((field) => (
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

					<div className="flex items-center justify-end gap-2 pt-6 border-t mt-6">
						<Button variant="outline" onClick={() => setShowCancelDialog(true)}>
							Cancel
						</Button>
						<Button
							onClick={() => setShowSaveDialog(true)}
							disabled={createItemMutation.isPending}
						>
							{createItemMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							<Save className="mr-2 h-4 w-4" />
							Save Entry
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
