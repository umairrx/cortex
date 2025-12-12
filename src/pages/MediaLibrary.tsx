import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

/**
 * Media Library page component for managing media assets.
 * Provides interface for uploading, organizing, and accessing media files.
 *
 * @returns The media library page with file management tools
 */
export default function MediaLibrary() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Media Library"
        description="Manage your media files here."
      />
    </DashboardLayout>
  );
}
