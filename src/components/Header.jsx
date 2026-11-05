import {
  Menu,
  UserCircle,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({
  title,
  student,
  onMenuClick,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // El SII puede devolver la fotografía como Base64
  // sin el prefijo que necesita el navegador.
  const foto = typeof student?.foto === "string"
    ? student.foto.trim()
    : "";

  const fotoSrc = foto
    ? foto.startsWith("data:image/")
      ? foto
      : `data:image/jpeg;base64,${foto.replace(/\s/g, "")}`
    : null;

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1>{title}</h1>
          <span>Portal académico SII ITC</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-period">
          <span>Periodo académico</span>
          <strong>Agosto - Diciembre 2026</strong>
        </div>

        <div className="header-divider" />

        <div className="header-user">
          {fotoSrc ? (
            <img
              className="header-avatar"
              src={fotoSrc}
              alt="Fotografía del estudiante"
            />
          ) : (
            <UserCircle size={36} />
          )}

          <div className="header-user-info">
            <span>{student?.nombreCompleto}</span>
            <span>{student?.numeroControl}</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <LogOut size={19} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
