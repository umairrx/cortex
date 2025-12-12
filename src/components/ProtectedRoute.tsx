import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.tsx";
import { Spinner } from "./ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin page with return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
