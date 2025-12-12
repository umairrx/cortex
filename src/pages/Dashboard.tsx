import { useAuth } from "../hooks/useAuth.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Welcome back, {user?.email}!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Content Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage your website content, pages, and media.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">User Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View user statistics and engagement metrics.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your CMS preferences and options.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
