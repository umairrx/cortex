import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFieldType } from "@/types/fields";

interface FieldRendererProps {
	field: {
		field_name: string;
		type: string;
		label: string;
	};
	value: string | string[] | number | boolean | null | undefined;
	onChange: (
		value: string | string[] | number | boolean | null | undefined,
	) => void;
	error?: string;
}

/**
 * Renders a form field component based on its type configuration.
 * Supports various field types including text inputs, textareas, date pickers,
 * image uploads, and rich text editors. Maps field type definitions to their
 * corresponding React components with appropriate props and event handlers.
 *
 * @param field - The field configuration containing name, type, and label
 * @param value - The current value of the field
 * @param onChange - Callback function when the field value changes
 * @param error - Optional error message to display
 * @returns The rendered field component or an error message if type is unknown
 */
export const FieldRenderer = ({
	field,
	value,
	onChange,
	error,
}: FieldRendererProps) => {
	const fieldType = getFieldType(field.type);

	if (!fieldType) {
		return <div>Unknown field type: {field.type}</div>;
	}

	const renderField = () => {
		switch (fieldType.component) {
			case "Input":
				return (
					<Input
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder={`Enter ${field.label.toLowerCase()}`}
						maxLength={fieldType.maxLength}
					/>
				);

			case "Textarea":
				return (
					<textarea
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder={`Enter ${field.label.toLowerCase()}`}
						maxLength={fieldType.maxLength}
						rows={4}
						className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				);

			case "DatePicker":
				return (
					<Input
						type="date"
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
					/>
				);

			case "ImageUpload":
				return (
					<ImageUpload
						value={value as string}
						onChange={onChange as (value: string) => void}
					/>
				);

			case "MultiImageUpload":
				return (
					<MultiImageUpload
						value={value as string[]}
						onChange={onChange as (value: string[]) => void}
					/>
				);

			case "RichTextEditor":
				return (
					<RichTextEditor
						value={value as string}
						onChange={onChange as (value: string) => void}
					/>
				);

			case "MarkdownEditor":
				return (
					<MarkdownEditor
						value={value as string}
						onChange={onChange as (value: string) => void}
					/>
				);

			default:
				return <div>Unsupported field type: {fieldType.component}</div>;
		}
	};

	return (
		<div className="space-y-2">
			<label
				htmlFor={`field-${field.field_name}`}
				className="text-sm font-medium"
			>
				{field.field_name}
				<span className="text-xs text-muted-foreground ml-2">
					({field.label})
				</span>
			</label>
			{renderField()}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};

// Field Components
const ImageUpload = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	const [preview, setPreview] = useState(value);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				setPreview(result);
				onChange(result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-2">
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="hidden"
				id="image-upload"
			/>
			<label htmlFor="image-upload">
				<Button variant="outline" className="cursor-pointer" asChild>
					<span>
						<Upload className="h-4 w-4 mr-2" />
						{preview ? "Change Image" : "Upload Image"}
					</span>
				</Button>
			</label>
			{preview && (
				<div className="relative">
					<img
						src={preview}
						alt="Preview"
						className="max-w-full h-32 object-cover rounded"
					/>
					<Button
						variant="destructive"
						size="sm"
						className="absolute top-2 right-2"
						onClick={() => {
							setPreview("");
							onChange("");
						}}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
};

const MultiImageUpload = ({
	value,
	onChange,
}: {
	value: string[];
	onChange: (value: string[]) => void;
}) => {
	const [images, setImages] = useState<string[]>(value || []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const newImages: string[] = [];

		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				newImages.push(reader.result as string);
				if (newImages.length === files.length) {
					const updated = [...images, ...newImages];
					setImages(updated);
					onChange(updated);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	const removeImage = (index: number) => {
		const updated = images.filter((_, i) => i !== index);
		setImages(updated);
		onChange(updated);
	};

	return (
		<div className="space-y-2">
			<input
				type="file"
				accept="image/*"
				multiple
				onChange={handleFileChange}
				className="hidden"
				id="multi-image-upload"
			/>
			<label htmlFor="multi-image-upload">
				<Button variant="outline" className="cursor-pointer" asChild>
					<span>
						<Upload className="h-4 w-4 mr-2" />
						Upload Images
					</span>
				</Button>
			</label>
			{images.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
					{images.map((image, index) => (
						<div key={image} className="relative">
							<img
								src={image}
								alt="Uploaded content"
								className="w-full h-24 object-cover rounded"
							/>
							<Button
								variant="destructive"
								size="sm"
								className="absolute top-1 right-1"
								onClick={() => removeImage(index)}
							>
								<X className="h-3 w-3" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const RichTextEditor = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	return (
		<Textarea
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter rich text content..."
			rows={6}
			className="font-serif"
		/>
	);
};

const MarkdownEditor = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	return (
		<Textarea
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter markdown content..."
			rows={6}
			className="font-mono"
		/>
	);
};
