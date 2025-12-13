import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type CollectionNameValidationResult,
	validateAndNormalizeCollectionName,
} from "@/utils/collectionNameValidator";

interface CollectionNameInputProps {
	collectionNameInput: string;
	setCollectionNameInput: (value: string) => void;
	collectionNameValidation: CollectionNameValidationResult | null;
	setCollectionNameValidation: (
		validation: CollectionNameValidationResult | null,
	) => void;
	customPlural: string;
	setCustomPlural: (value: string) => void;
}

/**
 * Component for collection name input with real-time validation and plural editing
 */
export const CollectionNameInput = ({
	collectionNameInput,
	setCollectionNameInput,
	collectionNameValidation,
	setCollectionNameValidation,
	customPlural,
	setCustomPlural,
}: CollectionNameInputProps) => {
	return (
		<div className="space-y-2">
			<Label htmlFor="collectionName">Collection Name</Label>
			<Input
				id="collectionName"
				value={collectionNameInput}
				onChange={(e) => {
					const input = e.target.value;
					setCollectionNameInput(input);
					// Reset custom plural when collection name changes
					setCustomPlural("");
					// Real-time validation
					if (input.trim()) {
						const validation = validateAndNormalizeCollectionName(input);
						setCollectionNameValidation(validation);
					} else {
						setCollectionNameValidation(null);
					}
				}}
				placeholder="e.g., Blog Posts"
				className="w-full"
			/>
			{collectionNameValidation && !collectionNameValidation.isValid && (
				<div className="space-y-1">
					{collectionNameValidation.errors.map((error) => (
						<div key={error} className="text-sm text-red-500">
							• {error}
						</div>
					))}
				</div>
			)}
			{collectionNameValidation?.isValid && (
				<Alert className="border-primary/20 bg-primary/5">
					<CheckCircle className="h-4 w-4 text-primary" />
					<AlertTitle className="text-foreground font-medium">
						Collection Name Valid
					</AlertTitle>
					<AlertDescription className="text-muted-foreground">
						<div className="space-y-3 mt-2">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
										Singular (API)
									</div>
									<Badge variant="secondary" className="font-mono text-xs">
										{collectionNameValidation.singular}
									</Badge>
								</div>
								<div className="space-y-1">
									<div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
										Plural (Collection)
									</div>
									<Input
										value={customPlural || collectionNameValidation.plural}
										onChange={(e) => setCustomPlural(e.target.value)}
										className="font-mono text-xs h-8"
										placeholder={collectionNameValidation.plural}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									API Routes
								</div>
								<div className="space-y-1">
									<code className="block text-xs bg-muted px-2 py-1 rounded border font-mono">
										/{collectionNameValidation.singular}/:id
									</code>
									<code className="block text-xs bg-muted px-2 py-1 rounded border font-mono">
										/{customPlural || collectionNameValidation.plural}
									</code>
								</div>
							</div>
						</div>
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
};
