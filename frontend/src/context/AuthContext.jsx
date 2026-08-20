import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fitpulse_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const persist = (data) => {
    localStorage.setItem("fitpulse_user", JSON.stringify(data));
    setUser(data);
  };

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await api.post("/users/login", { email, password });
      persist(data);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Unable to sign in");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
      });
      persist(data);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Unable to create account");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fitpulse_user");
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    persist({ ...data });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        authError,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
