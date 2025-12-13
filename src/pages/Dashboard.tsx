import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

/**
 * Dashboard page component that serves as the main landing page
 * for the Cortex CMS application. Displays welcome information
 * and provides access to key features.
 *
 * @returns The dashboard page with header and welcome content
 */
export default function Dashboard() {
	return (
		<DashboardLayout>
			<PageHeader
				title="Dashboard"
				description="Welcome to the Cortex CMS dashboard."
			/>
		</DashboardLayout>
	);
}
