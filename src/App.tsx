
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import BoardPage from "./pages/BoardPage";
import TasksPage from "./pages/TasksPage";
import AccountsPage from "./pages/AccountsPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout><DashboardPage /></Layout>} />
              <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
              <Route path="/board" element={<Layout><BoardPage /></Layout>} />
              <Route path="/tasks" element={<Layout><TasksPage /></Layout>} />
              <Route path="/accounts" element={<Layout><AccountsPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout><AdminPage /></Layout>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
