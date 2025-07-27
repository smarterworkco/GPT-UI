// client/src/lib/useAuth.tsx
import {
  onAuthStateChanged,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
  getAuth,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth as firebaseAuth } from "./firebase";

const auth = getAuth(firebaseAuth.app ?? undefined);

// Make sure persistence is set once
setPersistence(auth, browserLocalPersistence).catch((err) =>
  console.error("Persistence error:", err),
);

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("onAuthStateChanged triggered", firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ This named export avoids HMR issues
export function useAuth() {
  return useContext(AuthContext);
}
