
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Megaphone,
  CalendarDays,
  User,
  ArrowRight,
} from "lucide-react";

import "./Avisos.css";

const avisosDemo = [
  {
    id: "1",
    title: "Cancelación de clase",
    content:
      "Se informa a los estudiantes que la clase de hoy a las 18:00 horas queda cancelada. Favor de mantenerse atentos a nuevos avisos.",
    category: "academico",
    author_name: "Coordinación académica",
    author_email: "academico@celaya.tecnm.mx",
    control_number: "Administración",
    created_at: "2026-11-04T15:30:00.000Z",
  },
  {
    id: "2",
    title: "Semana de actividades culturales",
    content:
      "Se invita a toda la comunidad estudiantil a participar en las actividades culturales que se realizarán durante esta semana en las instalaciones del instituto.",
    category: "eventos",
    author_name: "Comunidad ITC",
    author_email: "comunidad@celaya.tecnm.mx",
    control_number: "Organización",
    created_at: "2026-11-03T12:00:00.000Z",
  },
  {
    id: "3",
    title: "Material de estudio disponible",
    content:
      "Se comparte información sobre recursos de apoyo para las próximas evaluaciones. Consulta los materiales con tus docentes.",
    category: "material_estudio",
    author_name: "Representante estudiantil",
    author_email: "alumno@celaya.tecnm.mx",
    control_number: "23030000",
    created_at: "2026-11-02T10:00:00.000Z",
  },
  {
    id: "4",
    title: "Convocatoria para estudiantes",
    content:
      "Se encuentra abierta la convocatoria para participar en las actividades de integración de nuestra comunidad estudiantil.",
    category: "comunidad",
    author_name: "Comunidad ITC",
    author_email: "comunidad@celaya.tecnm.mx",
    control_number: "Organización",
    created_at: "2026-11-01T09:00:00.000Z",
  },
];

const categories = [
  { value: "todos", label: "Todos" },
  { value: "academico", label: "Académico" },
  { value: "eventos", label: "Eventos" },
  { value: "comunidad", label: "Comunidad" },
  { value: "material_estudio", label: "Material de estudio" },
  { value: "otros", label: "Otros" },
];

const categoryLabels = {
  academico: "Académico",
  eventos: "Eventos",
  comunidad: "Comunidad",
  material_estudio: "Material de estudio",
  otros: "Otros",
};

export default function Avisos() {
  const [avisos] = useState(avisosDemo);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");

  const filteredAvisos = useMemo(() => {
    return avisos.filter((aviso) => {
      const matchesCategory =
        category === "todos" || aviso.category === category;

      const searchText = search.toLowerCase();

      const matchesSearch =
        aviso.title.toLowerCase().includes(searchText) ||
        aviso.content.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [avisos, category, search]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="avisos-container">

      {/* Encabezado */}
      <section className="avisos-heading">
        <div className="avisos-heading-info">
          <div className="avisos-heading-icon">
            <Megaphone size={26} />
          </div>

          <div>
            <h1>Muro de avisos</h1>
            <p>
              Mantente informado sobre las novedades de la
              comunidad académica.
            </p>
          </div>
        </div>

        <Link to="/avisos/crear" className="avisos-create-button">
          <Plus size={19} />
          <span>Publicar aviso</span>
        </Link>
      </section>

      {/* Búsqueda */}
      <section className="avisos-toolbar">
        <div className="avisos-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Buscar avisos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="avisos-count">
          {filteredAvisos.length} avisos encontrados
        </span>
      </section>

      {/* Filtros */}
      <section className="avisos-filters">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setCategory(item.value)}
            className={`avisos-filter ${
              category === item.value ? "selected" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </section>

      {/* Listado */}
      <section className="avisos-results">
        <div className="avisos-results-heading">
          <h2>Publicaciones recientes</h2>
          <span>Información de la comunidad ITC</span>
        </div>

        {filteredAvisos.length === 0 ? (
          <div className="avisos-empty">
            <Megaphone size={35} />
            <h3>No se encontraron avisos</h3>
            <p>
              Prueba con otra búsqueda o selecciona una categoría
              diferente.
            </p>
          </div>
        ) : (
          <div className="avisos-grid">
            {filteredAvisos.map((aviso) => (
              <article className="aviso-item" key={aviso.id}>
                <div className="aviso-item-top">
                  <span
                    className={`aviso-category category-${aviso.category}`}
                  >
                    {categoryLabels[aviso.category] || "Otros"}
                  </span>

                  <span className="aviso-date">
                    <CalendarDays size={14} />
                    {formatDate(aviso.created_at)}
                  </span>
                </div>

                <h3>{aviso.title}</h3>

                <p className="aviso-description">
                  {aviso.content}
                </p>

                <div className="aviso-item-footer">
                  <div className="aviso-author">
                    <div className="aviso-author-icon">
                      <User size={17} />
                    </div>

                    <div>
                      <strong>{aviso.author_name}</strong>
                      <small>
                        {aviso.control_number || aviso.author_email}
                      </small>
                    </div>
                  </div>

                  <Link
                    to={`/avisos/${aviso.id}`}
                    className="aviso-view-link"
                  >
                    Ver aviso
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
