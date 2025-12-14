import { Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTheme } from "@/components/use-theme";

interface FileItem {
	_id: string;
	filename: string;
	originalName: string;
	path: string;
	mimetype: string;
	size: number;
	createdAt: string;
}

import DashboardLayout from "@/layouts/DashboardLayout";

const MediaLibrary = () => {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [loading, setLoading] = useState(true);
	const { theme } = useTheme();

	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

	const fetchFiles = async () => {
		try {
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
	};

	useEffect(() => {
		fetchFiles();
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this file?")) return;

		try {
			const token = localStorage.getItem("accessToken");
			const response = await fetch(`${API_URL}/api/upload/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			});

			if (!response.ok) throw new Error("Failed to delete file");

			setFiles(files.filter((f) => f._id !== id));
			toast.success("File deleted successfully");
		} catch (error) {
			console.error("Error deleting file:", error);
			toast.error("Failed to delete file");
		}
	};

	const copyToClipboard = (path: string) => {
		const fullUrl = `${API_URL}${path}`;
		navigator.clipboard.writeText(fullUrl);
		toast.success("URL copied to clipboard");
	};

	return (
		<DashboardLayout>
			<div className="p-6 space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
						<p className="text-muted-foreground mt-2">
							Manage your uploaded images and files.
						</p>
					</div>
				</div>

				{loading ? (
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
						))}
					</div>
				) : files.length === 0 ? (
					<div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/10">
						<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
						<h3 className="mt-4 text-lg font-semibold">No media found</h3>
						<p className="text-muted-foreground">
							Upload files in the Content Manager to see them here.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{files.map((file) => (
							<Card key={file._id} className="overflow-hidden group relative">
								<CardContent className="p-0">
									<div className="relative aspect-square bg-muted">
										{file.mimetype.startsWith("image/") ? (
											<img
												src={`${API_URL}${file.path}`}
												alt={file.originalName}
												className="w-full h-full object-cover transition-transform group-hover:scale-105"
												loading="lazy"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-muted-foreground">
												<span className="font-mono text-xs uppercase p-2 break-all text-center">
													{file.originalName}
												</span>
											</div>
										)}

										<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
											<Button
												size="icon"
												variant="secondary"
												className="h-8 w-8 rounded-full"
												onClick={() => copyToClipboard(file.path)}
												title="Copy URL"
											>
												<Copy className="h-4 w-4" />
											</Button>
											<Button
												size="icon"
												variant="destructive"
												className="h-8 w-8 rounded-full"
												onClick={() => handleDelete(file._id)}
												title="Delete"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
									<div className="p-3 border-t">
										<p
											className="text-sm font-medium truncate"
											title={file.originalName}
										>
											{file.originalName}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											{(file.size / 1024).toFixed(1)} KB •{" "}
											{new Date(file.createdAt).toLocaleDateString()}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default MediaLibrary;
