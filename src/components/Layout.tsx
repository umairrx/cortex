import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "./mode-toggle.tsx";
import FontSelector from "./FontSelector.tsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex space-x-4">
            <Link to="/" className="text-lg font-semibold hover:underline">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <FontSelector />
            <ModeToggle />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
