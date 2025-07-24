// client/src/components/ProtectedRoute.tsx
import { useAuth } from "../lib/useAuth";
import { Redirect } from "wouter";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <Redirect to="/login" />;
  return children;
}
