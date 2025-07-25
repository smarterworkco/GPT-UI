import { useAuth } from "@/lib/useAuth";
import { Redirect } from "wouter";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  console.log("🔐 ProtectedRoute check →", { loading, user });

  if (loading) return <div className="p-4">Loading auth...</div>;

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
