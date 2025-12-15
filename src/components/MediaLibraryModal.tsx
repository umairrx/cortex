import { Check, Image as ImageIcon, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface FileItem {
	_id: string;
	filename: string;
	originalName: string;
	path: string;
	mimetype: string;
	size: number;
	createdAt: string;
}

interface MediaLibraryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (urls: string[]) => void;
	multiple?: boolean;
}

export function MediaLibraryModal({
	open,
	onOpenChange,
	onSelect,
	multiple = false,
}: MediaLibraryModalProps) {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState("library");

	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

	const fetchFiles = useCallback(async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("accessToken");
			const response = await fetch(`${API_URL}/api/upload`, {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			});
			if (!response.ok) throw new Error("Failed to fetch files");
			const data = await response.json();
			setFiles(data);
		} catch (error) {
			console.error("Error fetching files:", error);
			toast.error("Failed to load media library");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (open) {
			fetchFiles();
			setSelectedFiles([]);
		}
	}, [open, fetchFiles]);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = e.target.files;
		if (!fileList || fileList.length === 0) return;

		setUploading(true);
		try {
			const formData = new FormData();

			const isMultipleUpload = fileList.length > 1;
			const token = localStorage.getItem("accessToken");

			if (isMultipleUpload) {
				for (const file of Array.from(fileList)) {
					formData.append("files", file);
				}
				const response = await fetch(`${API_URL}/api/upload/multiple`, {
					method: "POST",
					headers: { Authorization: token ? `Bearer ${token}` : "" },
					body: formData,
				});
				if (!response.ok) throw new Error("Upload failed");
				await response.json();

				await fetchFiles();
				setActiveTab("library");
				toast.success("Files uploaded successfully");
			} else {
				formData.append("file", fileList[0]);
				const response = await fetch(`${API_URL}/api/upload`, {
					method: "POST",
					headers: { Authorization: token ? `Bearer ${token}` : "" },
					body: formData,
				});
				if (!response.ok) throw new Error("Upload failed");
				await response.json();
				await fetchFiles();
				setActiveTab("library");

				toast.success("File uploaded successfully");
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload file");
		} finally {
			setUploading(false);

			e.target.value = "";
		}
	};

	const toggleSelection = (path: string) => {
		const fullUrl = `${API_URL}${path}`;
		if (multiple) {
			setSelectedFiles((prev) =>
				prev.includes(fullUrl)
					? prev.filter((p) => p !== fullUrl)
					: [...prev, fullUrl],
			);
		} else {
			setSelectedFiles([fullUrl]);
		}
	};

	const handleConfirm = () => {
		onSelect(selectedFiles);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
				<DialogHeader className="p-6 pb-2">
					<DialogTitle>Media Library</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-hidden flex flex-col">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col"
					>
						<div className="px-6 border-b">
							<TabsList>
								<TabsTrigger value="library">Library</TabsTrigger>
								<TabsTrigger value="upload">Upload</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent
							value="library"
							className="flex-1 overflow-hidden p-0 m-0 relative"
						>
							<ScrollArea className="h-full p-6">
								{loading ? (
									<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
										{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
											<div
												key={i}
												className="aspect-square rounded-lg bg-muted animate-pulse"
											/>
										))}
									</div>
								) : files.length === 0 ? (
									<div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/10">
										<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
										<h3 className="mt-4 text-lg font-semibold">
											No media found
										</h3>
										<p className="text-muted-foreground">
											Upload files to see them here.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
										{files.map((file) => {
											const fullUrl = `${API_URL}${file.path}`;
											const isSelected = selectedFiles.includes(fullUrl);

											return (
												<button
													key={file._id}
													type="button"
													className={cn(
														"relative group aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all",
														isSelected
															? "ring-2 ring-primary border-primary"
															: "hover:border-primary/50",
													)}
													onClick={() => toggleSelection(file.path)}
												>
													{file.mimetype.startsWith("image/") ? (
														<img
															src={fullUrl}
															alt={file.originalName}
															className="w-full h-full object-cover"
															loading="lazy"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-2">
															<span className="text-xs text-center break-all">
																{file.originalName}
															</span>
														</div>
													)}

													{isSelected && (
														<div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
															<Check className="w-3 h-3" />
														</div>
													)}

													<div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
														<p className="text-xs text-white truncate">
															{file.originalName}
														</p>
													</div>
												</button>
											);
										})}
									</div>
								)}
							</ScrollArea>

							<div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t flex justify-between items-center">
								<div className="text-sm text-muted-foreground">
									{selectedFiles.length} file
									{selectedFiles.length !== 1 ? "s" : ""} selected
								</div>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => onOpenChange(false)}>
										Cancel
									</Button>
									<Button
										onClick={handleConfirm}
										disabled={selectedFiles.length === 0}
									>
										Insert Selected
									</Button>
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="upload"
							className="flex-1 flex items-center justify-center p-6 m-0"
						>
							<div className="w-full max-w-xl">
								<label
									htmlFor="modal-upload"
									className={`
                                        flex flex-col items-center justify-center w-full h-64 
                                        border-2 border-dashed rounded-lg cursor-pointer 
                                        bg-muted/50 hover:bg-muted/80 transition-colors
                                        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										{uploading ? (
											<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
										) : (
											<Upload className="w-10 h-10 mb-4 text-muted-foreground" />
										)}
										<p className="mb-2 text-sm text-muted-foreground">
											<span className="font-semibold">Click to upload</span> or
											drag and drop
										</p>
										<p className="text-xs text-muted-foreground">
											SVG, PNG, JPG or GIF (MAX. 10MB)
										</p>
									</div>
									<input
										id="modal-upload"
										type="file"
										className="hidden"
										multiple
										accept="image/*"
										onChange={handleUpload}
										disabled={uploading}
									/>
								</label>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
}
