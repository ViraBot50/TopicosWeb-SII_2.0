import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Detectar cuando el backend rechaza una sesión.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // No interferir con los errores del formulario de login.
    if (status === 401 && !url.includes("/auth/login")) {
      window.dispatchEvent(
        new Event("auth:unauthorized")
      );
    }

    return Promise.reject(error);
  }
);

export default api;
