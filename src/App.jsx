import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calificaciones from "./pages/Calificaciones";
import Kardex from "./pages/Kardex";
import Horarios from "./pages/Horarios";
import Avisos from "./pages/avisos/Avisos";
import CrearAviso from "./pages/avisos/CrearAviso";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/calificaciones"
                element={<Calificaciones />}
              />

              <Route
                path="/kardex"
                element={<Kardex />}
              />

              <Route
                path="/horarios"
                element={<Horarios />}
              />

              <Route
                path="/avisos"
                element={<Avisos />}
              />

              <Route
                path="/avisos/crear"
                element={<CrearAviso />}
              />
            </Route>
          </Route>

          {/* Ruta inicial */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Rutas no encontradas */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
