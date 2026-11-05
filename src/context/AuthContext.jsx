import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  login as loginService,
  logout as logoutService,
  checkSession,
} from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const channelRef = useRef(null);

  // Comprobar la sesión y escuchar los cambios
  // de autenticación de otras pestañas.
  useEffect(() => {
    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("sii-auth")
        : null;

    channelRef.current = channel;

    // Otra pestaña cerró la sesión.
    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === "logout") {
          setAuthenticated(false);
        }
      };
    }

    // El backend rechazó una petición con HTTP 401.
    const handleUnauthorized = () => {
      setAuthenticated(false);

      channel?.postMessage({
        type: "logout",
      });
    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    // Comprobar si existe una sesión válida.
    const verifySession = async () => {
      try {
        await checkSession();
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );

      channel?.close();
      channelRef.current = null;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await loginService(email, password);

      setAuthenticated(true);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error.message
      );
    } finally {
      setAuthenticated(false);

      // Avisar a las demás pestañas.
      channelRef.current?.postMessage({
        type: "logout",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        login,
        logout,
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
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}
