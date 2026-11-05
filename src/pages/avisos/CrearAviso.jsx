
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  FileText,
  Tag,
  AlignLeft,
} from "lucide-react";

import "./CrearAviso.css";

const initialForm = {
  title: "",
  content: "",
  category: "academico",
};

const categories = [
  { value: "academico", label: "Académico" },
  { value: "eventos", label: "Eventos" },
  { value: "comunidad", label: "Comunidad" },
  { value: "material_estudio", label: "Material de estudio" },
  { value: "otros", label: "Otros" },
];

export default function CrearAviso() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [publishing, setPublishing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
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
      setSuccess("");

      // Pendiente: conectar con el backend.
      // await crearAviso({ title, content, category: form.category });

      console.log("Aviso preparado:", {
        title,
        content,
        category: form.category,
      });

      setSuccess(
        "El formulario es válido. La publicación estará disponible cuando conectemos el backend."
      );
    } catch (err) {
      console.error("Error al publicar aviso:", err);
      setError("No fue posible publicar el aviso.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="crear-aviso-container">

      {/* Navegación */}
      <Link to="/avisos" className="crear-aviso-back">
        <ArrowLeft size={18} />
        Regresar al muro
      </Link>

      {/* Encabezado */}
      <div className="crear-aviso-heading">
        <div className="crear-aviso-heading-icon">
          <FileText size={25} />
        </div>

        <div>
          <h1>Publicar un aviso</h1>
          <p>
            Comparte información importante con la comunidad
            académica.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form
        className="crear-aviso-form"
        onSubmit={handleSubmit}
      >
        <div className="crear-aviso-section-title">
          <h2>Información del aviso</h2>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>

        {error && (
          <div className="crear-aviso-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="crear-aviso-message success">
            {success}
          </div>
        )}

        {/* Título */}
        <div className="crear-aviso-field">
          <label htmlFor="title">
            <FileText size={16} />
            Título del aviso *
          </label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="Ej. Cancelación de clase"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
            required
          />

          <span className="crear-aviso-counter">
            {form.title.length}/120 caracteres
          </span>
        </div>

        {/* Categoría */}
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

        {/* Contenido */}
        <div className="crear-aviso-field">
          <label htmlFor="content">
            <AlignLeft size={16} />
            Contenido del aviso *
          </label>

          <textarea
            id="content"
            name="content"
            placeholder="Escribe aquí la información que deseas compartir con los estudiantes..."
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

        {/* Acciones */}
        <div className="crear-aviso-actions">
          <Link
            to="/avisos"
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
            {publishing ? "Procesando..." : "Publicar aviso"}
          </button>
        </div>
      </form>

      <div className="crear-aviso-note">
        <strong>Importante:</strong> verifica que la información
        sea clara y correcta antes de compartirla.
      </div>
    </div>
  );
}
