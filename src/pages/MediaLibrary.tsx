import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Media Library page component for managing media assets.
 * Provides interface for uploading, organizing, and accessing media files.
 *
 * @returns The media library page with file management tools
 */
export default function MediaLibrary() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Media Library"
        description="Manage your media files here."
      />
      <div className="p-6 space-y-6 h-screen">
        <Input
          ref={fileInputRef}
          id="media"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {files.length === 0 && (
          <div className="flex justify-center items-center w-full h-full">
            <div
              className={cn(
                "relative w-full h-full border-2 border-dashed rounded-2xl bg-muted/60 shadow-lg flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
                isDragOver
                  ? "border-primary bg-primary/10 shadow-2xl"
                  : "border-muted-foreground/25"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload files"
              style={{ height: "100%" }}
            >
              <div className="flex flex-col items-center gap-4">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg h-16 w-16 mb-2">
                  <Upload className="h-8 w-8" />
                </span>
                <div>
                  <div className="text-xl font-semibold mb-1">
                    Drop files here or click to upload
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Support for images, videos, and documents
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-2"
                >
                  Choose Files
                </Button>
              </div>
            </div>
          </div>
        )}
        {files.length > 0 && (
          <>
            <Button onClick={() => fileInputRef.current?.click()}>
              Upload More Files
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          {file.name}
                        </span>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
