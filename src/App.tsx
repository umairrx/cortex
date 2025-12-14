import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef } from "react";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";
import Layout from "./components/Layout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { useTheme } from "./components/use-theme";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CollectionsProvider } from "./contexts/CollectionsContext.tsx";
import ApiIntegration from "./pages/ApiIntegration.tsx";
import CollectionTypesBuilder from "./pages/CollectionTypesBuilder.tsx";
import CollectionWrapper from "./pages/CollectionWrapper.tsx";
import ContentCreate from "./pages/ContentCreate.tsx";
import ContentManager from "./pages/ContentManager.tsx";
import CreateCollection from "./pages/CreateCollection.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import MediaLibrary from "./pages/MediaLibrary.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";

/**
 * Main application content component that sets up routing and displays the loading bar.
 * Manages navigation between different pages and handles route protection.
 * Renders a continuous loading bar that animates on route changes.
 *
 * @returns The application routes with a loading bar indicator
 */

const queryClient = new QueryClient();

function AppContent() {
	const loadingBarRef = useRef<LoadingBarRef | null>(null);
	const { theme } = useTheme();

	useEffect(() => {
		loadingBarRef.current?.continuousStart?.();

		const timer = setTimeout(() => {
			loadingBarRef.current?.complete?.();
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	const loadingBarColor = theme === "dark" ? "#64b5f6" : "#64b5f6";

	return (
		<>
			<LoadingBar
				ref={loadingBarRef}
				color={loadingBarColor}
				height={3}
				shadow={true}
				loaderSpeed={500}
				waitingTime={200}
				transitionTime={300}
			/>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/content-manager"
						element={
							<ProtectedRoute>
								<ContentManager />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/content-manager/:collectionId/create"
						element={
							<ProtectedRoute>
								<ContentCreate />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/media-library"
						element={
							<ProtectedRoute>
								<MediaLibrary />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/collection-types-builder"
						element={
							<ProtectedRoute>
								<CollectionTypesBuilder />
							</ProtectedRoute>
						}
					>
						<Route index element={<CreateCollection />} />
						<Route path=":id" element={<CollectionWrapper />} />
					</Route>
					<Route
						path="/api-integration"
						element={
							<ProtectedRoute>
								<ApiIntegration />
							</ProtectedRoute>
						}
					/>
				</Route>
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
			</Routes>
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}

/**
 * Root App component that sets up all providers and context layers.
 * Initializes theme, authentication, collections, and routing providers.
 * Wraps the entire application with necessary context providers and renders the main app content.
 *
 * @returns The complete application with all providers and context layers
 */
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<AuthProvider>
					<CollectionsProvider>
						<Router>
							<AppContent />
						</Router>
					</CollectionsProvider>
				</AuthProvider>
				<Toaster />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
