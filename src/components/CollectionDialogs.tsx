import type React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type CollectionNameValidationResult,
	validateAndNormalizeCollectionName,
} from "@/utils/collectionNameValidator";
import { reservedWords } from "@/utils/reservedWords";

const fieldNameSchema = z
	.string()
	.refine((value) => /^[a-z][a-zA-Z0-9]*$/.test(value), {
		message:
			"Field name must be camelCase, start with a lowercase letter, and contain only letters and numbers.",
	})
	.refine((value) => !/^[0-9]/.test(value), {
		message: "Field name cannot start with a number.",
	})
	.refine((value) => !reservedWords.includes(value), {
		message: "Field name cannot be a reserved word.",
	})
	.refine(
		(value) => {
			if (
				value.startsWith("is") ||
				value.startsWith("has") ||
				value.startsWith("can") ||
				value.startsWith("should")
			) {
				return true;
			}
			if (value.endsWith("At") || value.endsWith("Id")) {
				return true;
			}
			if (value.endsWith("s")) {
				return true;
			}
			return !value.match(/^(is|has|can|should|.*At|.*Id|.*s)$/);
		},
		{
			message:
				"Boolean fields must start with is, has, can, or should. Date/time fields must end with At. Relation fields must end with Id. Arrays must use plural nouns.",
		},
	);

type FieldBeingAdded = {
	fieldName: string;
	type: string;
	field_name: string;
} | null;

interface CollectionDialogsProps {
	// Create/Edit Collection Dialog
	showCreateCollectionDialog: boolean;
	setShowCreateCollectionDialog: (show: boolean) => void;
	isCollectionCreated: boolean;
	collectionDraftName: string;
	setCollectionDraftName: (value: string) => void;
	prevCollectionName: string;
	setPrevCollectionName: (value: string) => void;
	setCollectionNameInput: (value: string) => void;
	collectionNameValidation: CollectionNameValidationResult | null;
	setCollectionNameValidation: (
		validation: CollectionNameValidationResult | null,
	) => void;
	customPlural: string;
	setCustomPlural: (value: string) => void;
	setSelectedFields: (fields: string[]) => void;
	setSelectedTypes: (types: Record<string, string>) => void;

	// Delete Collection Dialog
	showDeleteConfirmDialog: boolean;
	setShowDeleteConfirmDialog: (show: boolean) => void;
	setIsCollectionCreated: (created: boolean) => void;

	// Field Name Dialog
	showFieldNameDialog: boolean;
	setShowFieldNameDialog: (show: boolean) => void;
	fieldBeingAdded: FieldBeingAdded;
	setFieldBeingAdded: React.Dispatch<React.SetStateAction<FieldBeingAdded>>;
	fieldNameError: string;
	setFieldNameError: (error: string) => void;
	addSelectedField: (type: string, field_name: string) => void;
}

/**
 * Component containing all collection-related dialogs
 */
export const CollectionDialogs = ({
	showCreateCollectionDialog,
	setShowCreateCollectionDialog,
	isCollectionCreated,
	collectionDraftName,
	setCollectionDraftName,
	prevCollectionName,
	setPrevCollectionName,
	setCollectionNameInput,
	collectionNameValidation,
	setCollectionNameValidation,
	customPlural,
	setCustomPlural,
	setSelectedFields,
	setSelectedTypes,
	showDeleteConfirmDialog,
	setShowDeleteConfirmDialog,
	setIsCollectionCreated,
	showFieldNameDialog,
	setShowFieldNameDialog,
	fieldBeingAdded,
	setFieldBeingAdded,
	fieldNameError,
	setFieldNameError,
	addSelectedField,
}: CollectionDialogsProps) => {
	return (
		<>
			<Dialog
				open={showCreateCollectionDialog}
				onOpenChange={setShowCreateCollectionDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isCollectionCreated
								? "Collection Details (Read-Only)"
								: "Create New Collection"}
						</DialogTitle>
						<DialogDescription>
							{isCollectionCreated
								? "View the details of the created collection."
								: "Enter a name for your new collection. The name should be unique and descriptive."}
						</DialogDescription>
					</DialogHeader>
					{!isCollectionCreated ? (
						<>
							<div className="space-y-2">
								<Label htmlFor="collectionDraftName">
									Collection Name (Display Name)
								</Label>
								<Input
									id="collectionDraftName"
									value={collectionDraftName}
									onChange={(e) => setCollectionDraftName(e.target.value)}
									placeholder="e.g., Blog Posts"
								/>
							</div>
							<DialogFooter>
								<Button
									variant="ghost"
									onClick={() => {
										setCollectionDraftName(prevCollectionName);
										setShowCreateCollectionDialog(false);
										if (!isCollectionCreated) {
											setCollectionNameInput("");
											setCollectionNameValidation(null);
											setCustomPlural("");
											setSelectedFields([]);
											setSelectedTypes({});
										}
									}}
								>
									Discard
								</Button>
								<Button
									disabled={!collectionDraftName.trim()}
									onClick={() => {
										if (collectionDraftName.trim()) {
											setCollectionNameInput(collectionDraftName.trim());
											const validation = validateAndNormalizeCollectionName(
												collectionDraftName.trim(),
											);
											setCollectionNameValidation(validation);
											setPrevCollectionName(collectionDraftName.trim());
											setShowCreateCollectionDialog(false);
										}
									}}
								>
									{isCollectionCreated ? "Save" : "Create"}
								</Button>
							</DialogFooter>
						</>
					) : (
						<>
							<div className="space-y-3">
								<div className="space-y-2">
									<Label>Display Name</Label>
									<div className="p-3 bg-muted rounded border text-sm">
										{collectionNameValidation?.displayName}
									</div>
								</div>
								<div className="space-y-2">
									<Label>Singular (Internal/API)</Label>
									<div className="p-3 bg-muted rounded border text-sm font-mono">
										{collectionNameValidation?.singular}
									</div>
									<p className="text-xs text-muted-foreground">
										Used for individual resource routes: /
										{collectionNameValidation?.singular}
										/:id
									</p>
								</div>
								<div className="space-y-2">
									<Label>Plural (Collection)</Label>
									<div className="p-3 bg-muted rounded border text-sm font-mono">
										{customPlural || collectionNameValidation?.plural}
									</div>
									<p className="text-xs text-muted-foreground">
										Used for collection routes: /
										{customPlural || collectionNameValidation?.plural}
									</p>
								</div>
								<div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
									<p className="font-medium mb-1">Note:</p>
									<p>
										Collection identifiers are immutable once created to ensure
										API route stability and database consistency.
									</p>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="ghost"
									onClick={() => {
										setShowCreateCollectionDialog(false);
									}}
								>
									Close
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={showDeleteConfirmDialog}
				onOpenChange={setShowDeleteConfirmDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Collection</DialogTitle>
						<DialogDescription>
							This will permanently remove the collection and all its selected
							fields. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2">
						<p>
							Are you sure you want to discard the collection "
							{collectionNameValidation?.displayName}"? This will remove all
							selected fields.
						</p>
					</div>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setShowDeleteConfirmDialog(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								setCollectionNameInput("");
								setCollectionNameValidation(null);
								setCustomPlural("");
								setPrevCollectionName("");
								setCollectionDraftName("");
								setSelectedFields([]);
								setSelectedTypes({});
								setIsCollectionCreated(false);
								setShowDeleteConfirmDialog(false);
							}}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showFieldNameDialog} onOpenChange={setShowFieldNameDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Enter Field Name</DialogTitle>
						<DialogDescription>
							Provide a unique name for this field. The name should be
							descriptive and follow naming conventions.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<Label htmlFor="fieldName">Field Name</Label>
						<Input
							id="fieldName"
							value={fieldBeingAdded?.field_name || ""}
							onChange={(e) => {
								const value = e.target.value;
								const normalizedValue = value
									.replace(/[^a-zA-Z0-9]/g, "")
									.replace(/^[0-9]+/, "")
									.replace(/^[A-Z]/, (char) => char.toLowerCase());
								setFieldBeingAdded((prev: FieldBeingAdded) =>
									prev ? { ...prev, field_name: normalizedValue } : prev,
								);

								const result = fieldNameSchema.safeParse(normalizedValue);
								if (result.success) {
									setFieldNameError("");
								} else {
									setFieldNameError(result.error.issues[0].message);
								}
							}}
						/>
						{fieldNameError && (
							<div className="text-sm text-red-500">{fieldNameError}</div>
						)}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								onClick={() => {
									if (fieldBeingAdded?.field_name?.trim() && !fieldNameError) {
										addSelectedField(
											fieldBeingAdded.type,
											fieldBeingAdded.field_name.trim(),
										);
									}
								}}
								disabled={
									!fieldBeingAdded?.field_name?.trim() || !!fieldNameError
								}
							>
								Add Field
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
