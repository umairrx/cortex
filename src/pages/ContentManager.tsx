import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

/**
 * Content Manager page component for managing CMS content.
 * Provides interface for creating, editing, and organizing content items.
 *
 * @returns The content manager page with management tools
 */
export default function ContentManager() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Content Manager"
        description="Manage your content here."
      />
    </DashboardLayout>
  );
}
