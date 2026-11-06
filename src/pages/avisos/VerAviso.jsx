
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  User,
  Megaphone,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  getAviso,
  eliminarAviso,
} from "../../services/avisos.service";

import "./Avisos.css";

const categoryLabels = {
  academico: "Académico",
  eventos: "Eventos",
  general: "General",
  servicios: "Servicios",
  otros: "Otros",
};

export default function VerAviso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAdmin } = useAuth();

  const [aviso, setAviso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cargarAviso = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAviso(id);

        if (response.success === false) {
          throw new Error(
            response.message ||
            response.mensaje ||
            "No fue posible consultar el aviso."
          );
        }

        setAviso(response.data);
      } catch (err) {
        console.error("Error al consultar aviso:", err);

        setError(
          err.response?.data?.mensaje ||
          err.response?.data?.message ||
          err.message ||
          "No fue posible cargar el aviso."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarAviso();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Fecha no disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Fecha no disponible";
    }

    return parsedDate.toLocaleString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este aviso? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await eliminarAviso(id);

      navigate("/avisos", {
        replace: true,
        state: { avisoEliminado: true },
      });
    } catch (err) {
      console.error("Error al eliminar aviso:", err);

      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "No fue posible eliminar el aviso."
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="aviso-detalle-container">
        <div className="aviso-detalle-message">
          <Megaphone size={30} />
          <h2>Cargando aviso...</h2>
        </div>
      </div>
    );
  }

  if (error && !aviso) {
    return (
      <div className="aviso-detalle-container">
        <Link to="/avisos" className="aviso-detalle-back">
          <ArrowLeft size={18} />
          Regresar al muro
        </Link>

        <div className="aviso-detalle-message error">
          <h2>No fue posible cargar el aviso</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!aviso) return null;

  return (
    <div className="aviso-detalle-container">

      {/* Regresar */}
      <Link to="/avisos" className="aviso-detalle-back">
        <ArrowLeft size={18} />
        Regresar al muro
      </Link>

      {/* Contenido */}
      <article className="aviso-detalle-card">

        <div className="aviso-detalle-top">
          <span
            className={`aviso-category category-${aviso.category}`}
          >
            {categoryLabels[aviso.category] || "Otros"}
          </span>

          <span className="aviso-date">
            <CalendarDays size={15} />
            {formatDate(aviso.created_at)}
          </span>
        </div>

        <div className="aviso-detalle-heading">
          <div className="aviso-detalle-icon">
            <Megaphone size={25} />
          </div>

          <div>
            <span>AVISO INSTITUCIONAL</span>
            <h1>{aviso.title}</h1>
          </div>
        </div>

        <div className="aviso-detalle-content">
          {aviso.content}
        </div>

        <div className="aviso-detalle-author">
          <div className="aviso-author-icon">
            <User size={19} />
          </div>

          <div>
            <strong>
              {aviso.author_name || "Comunidad ITC"}
            </strong>

            <small>
              {aviso.control_number || aviso.author_email || ""}
            </small>
          </div>
        </div>

        {aviso.updated_at &&
          aviso.created_at !== aviso.updated_at && (
            <p className="aviso-detalle-updated">
              Última actualización: {formatDate(aviso.updated_at)}
            </p>
          )}

        {error && (
          <div className="aviso-detalle-error">
            {error}
          </div>
        )}

        {/* Acciones de administrador */}
        {isAdmin && (
          <div className="aviso-detalle-actions">

            <Link
              to={`/avisos/${aviso.id}/editar`}
              className="aviso-detalle-edit"
            >
              <Pencil size={17} />
              Editar aviso
            </Link>

            <button
              type="button"
              className="aviso-detalle-delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={17} />
              {deleting ? "Eliminando..." : "Eliminar aviso"}
            </button>

          </div>
        )}
      </article>
    </div>
  );
}
