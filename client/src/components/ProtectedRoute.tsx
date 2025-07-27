import { useAuth } from "@/lib/useAuth";
import { Redirect } from "wouter";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    console.log("[ProtectedRoute] Waiting on loading...");
    return null; // or a spinner
  }

  if (!user) {
    console.log("[ProtectedRoute] No user. Redirecting to /login...");
    return <Redirect to="/login" />;
  }

  console.log("[ProtectedRoute] Authenticated user:", user.email);
  return <>{children}</>;
}
