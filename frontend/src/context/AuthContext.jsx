import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sdms_token");
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      localStorage.removeItem("sdms_token");
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        const userData = res.data.data || res.data.user || res.data;
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("sdms_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const payload = res.data.data || res.data;
    if (payload.token) {
      localStorage.setItem("sdms_token", payload.token);
      setUser(payload.user);
    }
    return payload;
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    const payload = res.data.data || res.data;
    if (payload.token) {
      localStorage.setItem("sdms_token", payload.token);
      setUser(payload.user);
    }
    return payload;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("sdms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
