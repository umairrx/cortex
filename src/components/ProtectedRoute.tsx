import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.tsx";
import { Spinner } from "./ui/spinner";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

/**
 * A route guard component that protects pages from unauthenticated access.
 * Redirects unauthenticated users to the sign-in page and displays a loading spinner
 * while authentication status is being determined.
 *
 * @param children - The components to render if the user is authenticated
 * @returns The protected component or a redirect to sign-in/loading state
 */
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
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
