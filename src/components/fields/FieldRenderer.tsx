import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFieldType } from "@/types/fields";
import { MediaLibraryModal } from "../MediaLibraryModal";

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
						className="bg-background border-input"
					/>
				);

			case "Textarea":
				return (
					<Textarea
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder={`Enter ${field.label.toLowerCase()}`}
						maxLength={fieldType.maxLength}
						rows={4}
						className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-h-[40vh] overflow-auto resize-y"
					/>
				);

			case "DatePicker":
				return (
					<Input
						type="date"
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						className="bg-background border-input"
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
						onChange={(val) => onChange(val || "")}
					/>
				);

			case "Checkbox":
				return (
					<div className="flex items-center space-x-2 py-2">
						<Checkbox
							id={`field-${field.field_name}`}
							checked={Boolean(value)}
							onCheckedChange={(checked: boolean | "indeterminate") =>
								onChange(checked === true)
							}
						/>
						<label
							htmlFor={`field-${field.field_name}`}
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{value ? "True" : "False"}
						</label>
					</div>
				);

			case "NumberInput":
			case "DecimalInput":
				return (
					<Input
						type="number"
						value={String(value || "")}
						onChange={(e) => {
							const val = e.target.value;
							if (fieldType.component === "NumberInput") {
								onChange(val === "" ? null : parseInt(val, 10));
							} else {
								onChange(val === "" ? null : parseFloat(val));
							}
						}}
						placeholder={`Enter ${field.label.toLowerCase()}...`}
						step={fieldType.component === "DecimalInput" ? "any" : "1"}
					/>
				);

			case "EmailInput":
				return (
					<Input
						type="email"
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder="user@example.com"
					/>
				);

			case "UrlInput":
				return (
					<Input
						type="url"
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder="https://example.com"
					/>
				);

			case "ColorInput": {
				const colorValue = String(value || "");
				const isValidHex = /^#[0-9A-F]{6}$/i.test(colorValue);
				const pickerValue = isValidHex ? colorValue : "#000000";

				return (
					<div className="flex items-center gap-2">
						<div className="relative">
							<Input
								type="color"
								value={pickerValue}
								onChange={(e) => onChange(e.target.value)}
								className="w-12 h-10 p-1 cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
							/>
						</div>
						<Input
							type="text"
							value={colorValue}
							onChange={(e) => onChange(e.target.value)}
							placeholder="#000000"
							maxLength={7}
							className="font-mono flex-1 uppercase"
						/>
					</div>
				);
			}

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
				{field.label}
				<span className="text-xs text-muted-foreground ml-2">
					({field.field_name})
				</span>
			</label>
			{renderField()}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};

const ImageUpload = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	const [preview, setPreview] = useState(value);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		setPreview(value);
	}, [value]);

	const handleSelect = (urls: string[]) => {
		if (urls.length > 0) {
			const url = urls[0];
			setPreview(url);
			onChange(url);
		}
	};

	return (
		<div className="space-y-3">
			<MediaLibraryModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				onSelect={handleSelect}
				multiple={false}
			/>

			{!preview ? (
				<button
					type="button"
					onClick={() => setModalOpen(true)}
					className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/60 transition-colors"
				>
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<Upload className="w-8 h-8 mb-2 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							Click to select or upload image
						</p>
					</div>
				</button>
			) : (
				<div className="relative group rounded-lg overflow-hidden border bg-background w-fit">
					<img
						src={preview}
						alt="Preview"
						className="max-w-full h-48 object-contain"
					/>
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
						<Button
							variant="secondary"
							size="icon"
							className="h-8 w-8 rounded-full"
							onClick={() => setModalOpen(true)}
							title="Change Image"
						>
							<Upload className="h-4 w-4" />
						</Button>
						<Button
							variant="destructive"
							size="icon"
							className="h-8 w-8 rounded-full"
							onClick={(e) => {
								e.stopPropagation();
								setPreview("");
								onChange("");
							}}
							title="Remove Image"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
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
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		setImages(value || []);
	}, [value]);

	const handleSelect = (urls: string[]) => {
		const newImages = [...images, ...urls];
		setImages(newImages);
		onChange(newImages);
	};

	const removeImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
		onChange(newImages);
	};

	return (
		<div className="space-y-4">
			<MediaLibraryModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				onSelect={handleSelect}
				multiple={true}
			/>

			<button
				type="button"
				onClick={() => setModalOpen(true)}
				className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/60 transition-colors"
			>
				<div className="flex flex-col items-center justify-center pt-5 pb-6">
					<Upload className="w-8 h-8 mb-2 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						Click to select multiple images
					</p>
				</div>
			</button>

			{images.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{images.map((image, index) => (
						<div
							key={image}
							className="relative group aspect-square rounded-lg overflow-hidden border bg-background"
						>
							<img
								src={image}
								alt={`Uploaded ${index + 1}`}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<Button
									variant="destructive"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={() => removeImage(index)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
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
			className="font-serif max-h-[40vh] overflow-auto resize-y"
		/>
	);
};
