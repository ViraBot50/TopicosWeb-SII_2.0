
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(user?.administrador);

  const checkSession = async () => {
    try {
      const { data } = await api.get("/auth/session");

      if (data.autenticado && data.usuario) {
        setUser(data.usuario);
        return data.usuario;
      }

      setUser(null);
      return null;
    } catch (error) {
      console.error(
        "Error verificando sesión:",
        error.response?.data?.mensaje || error.message
      );

      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    if (!data.autenticado || !data.usuario) {
      throw new Error(
        data.mensaje || "No fue posible iniciar sesión."
      );
    }

    setUser(data.usuario);

    return data.usuario;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        loading,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider."
    );
  }

  return context;
}
