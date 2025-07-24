import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatModal } from "@/components/chat/chat-modal";
import Dashboard from "@/pages/dashboard";
import AIAgents from "@/pages/ai-agents";
import Documents from "@/pages/documents";
import Feedback from "@/pages/feedback";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Login from "./components/Login";
import { AuthProvider } from "./lib/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
// 👈 ADDED this import

function Router() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route
            path="/"
            component={() => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/agents"
            component={() => (
              <ProtectedRoute>
                <AIAgents />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/documents"
            component={() => (
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/feedback"
            component={() => (
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/settings"
            component={() => (
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            )}
          />
          <Route path="/login" component={Login} /> {/* 👈 ADDED this route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <ChatModal />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          {" "}
          {/* 👈 Add this */}
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
