import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AppLayout } from "@/components/AppLayout";
import TransactionsPage from "@/pages/TransactionsPage";
import BudgetsPage from "@/pages/BudgetsPage";
import GoalsPage from "@/pages/GoalsPage";
import InsightsPage from "@/pages/InsightsPage";
import AuthPage from "@/pages/AuthPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useExpenseStore } from "@/lib/store";

const queryClient = new QueryClient();

function DarkModeInit() {
  const { darkMode } = useExpenseStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const WrappedPage = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><WrappedPage><TransactionsPage /></WrappedPage></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><WrappedPage><BudgetsPage /></WrappedPage></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><WrappedPage><GoalsPage /></WrappedPage></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><WrappedPage><InsightsPage /></WrappedPage></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DarkModeInit />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
