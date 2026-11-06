
import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  ArrowLeft,
  Send,
  FileText,
  Tag,
  AlignLeft,
} from "lucide-react";

import {
  getAviso,
  actualizarAviso,
} from "../../services/avisos.service";

import "./CrearAviso.css";

const categories = [
  { value: "academico", label: "Académico" },
  { value: "eventos", label: "Eventos" },
  { value: "general", label: "General" },
  { value: "servicios", label: "Servicios" },
  { value: "otros", label: "Otros" },
];

export default function EditarAviso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "academico",
  });

  const [loadingAviso, setLoadingAviso] = useState(true);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const cargarAviso = async () => {
      try {
        const response = await getAviso(id);

        if (response.success === false) {
          throw new Error(
            response.message ||
            response.mensaje ||
            "No fue posible obtener el aviso."
          );
        }

        const aviso = response.data;

        if (!aviso) {
          throw new Error("No se encontró el aviso.");
        }

        setForm({
          title: aviso.title || "",
          content: aviso.content || "",
          category: aviso.category || "academico",
        });
      } catch (err) {
        console.error("Error al cargar aviso:", err);

        setError(
          err.response?.data?.mensaje ||
          err.response?.data?.message ||
          err.message ||
          "No fue posible cargar el aviso."
        );
      } finally {
        setLoadingAviso(false);
      }
    };

    cargarAviso();
  }, [id]);

  if (loading) {
    return <p>Verificando permisos...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/avisos" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (title.length > 120) {
      setError("El título no puede superar los 120 caracteres.");
      return;
    }

    if (content.length > 5000) {
      setError("El contenido no puede superar los 5000 caracteres.");
      return;
    }

    try {
      setPublishing(true);
      setError("");

      const response = await actualizarAviso(id, {
        title,
        content,
        category: form.category,
      });

      if (response.success === false) {
        throw new Error(
          response.message ||
          response.mensaje ||
          "No fue posible actualizar el aviso."
        );
      }

      navigate(`/avisos/${id}`, {
        replace: true,
        state: { avisoActualizado: true },
      });
    } catch (err) {
      console.error("Error al actualizar aviso:", err);

      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.message ||
        "No fue posible actualizar el aviso."
      );
    } finally {
      setPublishing(false);
    }
  };

  if (loadingAviso) {
    return <p>Cargando información del aviso...</p>;
  }

  if (error && !form.title && !form.content) {
    return (
      <div className="crear-aviso-container">
        <Link to={`/avisos/${id}`} className="crear-aviso-back">
          <ArrowLeft size={18} />
          Regresar al aviso
        </Link>
        <div className="crear-aviso-message error">{error}</div>
      </div>
    );
  }

  return (
    <div className="crear-aviso-container">
      <Link to={`/avisos/${id}`} className="crear-aviso-back">
        <ArrowLeft size={18} />
        Regresar al aviso
      </Link>

      <div className="crear-aviso-heading">
        <div className="crear-aviso-heading-icon">
          <FileText size={25} />
        </div>

        <div>
          <h1>Editar aviso</h1>
          <p>Modifica la información de esta publicación.</p>
        </div>
      </div>

      <form className="crear-aviso-form" onSubmit={handleSubmit}>
        <div className="crear-aviso-section-title">
          <h2>Información del aviso</h2>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>

        {error && (
          <div className="crear-aviso-message error">
            {error}
          </div>
        )}

        <div className="crear-aviso-field">
          <label htmlFor="title">
            <FileText size={16} />
            Título del aviso *
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
            required
          />

          <span className="crear-aviso-counter">
            {form.title.length}/120 caracteres
          </span>
        </div>

        <div className="crear-aviso-field">
          <label htmlFor="category">
            <Tag size={16} />
            Categoría *
          </label>

          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>

          <span className="crear-aviso-help">
            Selecciona la categoría que mejor describa tu aviso.
          </span>
        </div>

        <div className="crear-aviso-field">
          <label htmlFor="content">
            <AlignLeft size={16} />
            Contenido del aviso *
          </label>

          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            maxLength={5000}
            rows={9}
            required
          />

          <span className="crear-aviso-counter">
            {form.content.length}/5000 caracteres
          </span>
        </div>

        <div className="crear-aviso-actions">
          <Link
            to={`/avisos/${id}`}
            className="crear-aviso-cancel"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="crear-aviso-submit"
            disabled={publishing}
          >
            <Send size={17} />
            {publishing ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>

      <div className="crear-aviso-note">
        <strong>Importante:</strong> verifica los cambios antes de
        actualizar la publicación.
      </div>
    </div>
  );
}
