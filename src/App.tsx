import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Layout from "./components/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ContentManager from "./pages/ContentManager.tsx";
import MediaLibrary from "./pages/MediaLibrary.tsx";
import ContentTypeBuilder from "./pages/ContentTypeBuilder.tsx";
import ApiIntegration from "./pages/ApiIntegration.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
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
                path="/content-type-builder"
                element={
                  <ProtectedRoute>
                    <ContentTypeBuilder />
                  </ProtectedRoute>
                }
              />
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
        </Router>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
