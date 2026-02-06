import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import DashboardLayout from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-background text-primary">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/api/login" />;
  }

  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  // If loading auth state, show nothing or spinner
  if (isLoading) return null;

  return (
    <Switch>
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Landing />}
      </Route>
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/dashboard/*" component={() => <ProtectedRoute component={DashboardLayout} />} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
