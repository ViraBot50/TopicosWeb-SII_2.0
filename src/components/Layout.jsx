
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Loading from "./Loading";

import { getEstudiante } from "../services/estudiante.service";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/calificaciones": "Calificaciones",
  "/kardex": "Kardex académico",
  "/horarios": "Horario escolar",
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  const title =
    pageTitles[location.pathname] || "Portal académico";

  useEffect(() => {
    let active = true;

    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEstudiante();

        if (active) {
          setStudent(data);
        }
      } catch (err) {
        console.error("Error al cargar estudiante:", err);

        if (active) {
          setError(
            "No fue posible cargar el perfil del estudiante."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudent();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-container">
        <Header
          title={title}
          student={student}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="page-content">
          {loading ? (
            <Loading message="Cargando perfil académico..." />
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : (
            <Outlet context={{ student }} />
          )}
        </main>
      </div>
    </div>
  );
}
