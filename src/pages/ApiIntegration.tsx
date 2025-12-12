import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

export default function ApiIntegration() {
  return (
    <DashboardLayout>
      <PageHeader
        title="API Integration"
        description="Manage and configure API integrations for your CMS."
      />
      <div className="p-6">
        <p>API integration content will go here.</p>
      </div>
    </DashboardLayout>
  );
}
