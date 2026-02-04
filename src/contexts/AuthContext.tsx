import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  signInWithGoogle: (credential: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.get('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);

      const userData = await api.get('/auth/me');
      setUser(userData);

      toast.success("Welcome back!");
      navigate("/learn");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const data = await api.post('/auth/register', { name: fullName, email, password });
      localStorage.setItem('token', data.token);

      const userData = await api.get('/auth/me');
      setUser(userData);

      toast.success("Account created! Welcome to TuluLip!");
      navigate("/learn");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  };

  const signInWithGoogle = async (credential: string) => {
    try {
      const data = await api.post('/auth/google', { token: credential });
      localStorage.setItem('token', data.token);

      const userData = await api.get('/auth/me');
      setUser(userData);

      toast.success("Successfully signed in with Google!");
      navigate("/learn");
    } catch (error: any) {
      toast.error(error.message || "Google Sign-In failed");
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
