
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Megaphone,
  ShieldCheck,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Calificaciones",
    path: "/calificaciones",
    icon: GraduationCap,
  },
  {
    name: "Kardex",
    path: "/kardex",
    icon: ClipboardList,
  },
  {
    name: "Horarios",
    path: "/horarios",
    icon: CalendarDays,
  },
  {
    name: "Muro de avisos",
    path: "/avisos",
    icon: Megaphone,
  },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${open ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BookOpen size={25} />
          </div>

          <div className="brand-text">
            <h2>SII ITC</h2>
            <span>Portal académico</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            MENÚ PRINCIPAL
          </span>

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {isAdmin && (
              <NavLink
                to="/admins"
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <ShieldCheck size={20} />
                <span>Administradores</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className="sidebar-footer">
          <strong>Instituto Tecnológico de Celaya</strong>
          <small>Sistema de información académica</small>
        </div>
      </aside>
    </>
  );
}
