import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Layout from "./components/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ContentManager from "./pages/ContentManager.tsx";
import MediaLibrary from "./pages/MediaLibrary.tsx";
import ApiIntegration from "./pages/ApiIntegration.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

import { useTheme } from "./components/use-theme";
import CollectionBuilds from "./pages/CollectionBuilds.tsx";
import CreateCollection from "./pages/CreateCollection.tsx";
import SingleCollectionBuilds from "./pages/SingleCollectionBuilds.tsx";
import CollectionTypesBuilder from "./pages/CollectionTypesBuilder.tsx";

function AppContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingBarRef = useRef<any>(null);
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    loadingBarRef.current?.continuousStart();

    const timer = setTimeout(() => {
      loadingBarRef.current?.complete();
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
            <Route path="blog" element={<CollectionBuilds />} />
            <Route path="case-study" element={<CollectionBuilds />} />
            <Route path="about-us" element={<SingleCollectionBuilds />} />
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
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
