import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

/**
 * Content Type Builder page component for defining and managing content types.
 * Allows users to create custom content structures and fields.
 *
 * @returns The content type builder page with creation tools
 */
export default function ContentTypeBuilder() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Content Type Builder"
        description="Build and manage your content types here."
      />
    </DashboardLayout>
  );
}
