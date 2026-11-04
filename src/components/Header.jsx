
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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
          {student?.foto ? (
            <img
              className="header-avatar"
              src={student.foto}
              alt="Fotografía del estudiante"
            />
          ) : (
            <UserCircle size={32} />
          )}

          <div className="header-user-info">
            <strong>
              {student?.persona || "Estudiante"}
            </strong>

            <span>
              {student?.numero_control || "Cargando perfil..."}
            </span>
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
