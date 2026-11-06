
import { useAuth } from "../../context/AuthContext";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Plus,
  Megaphone,
  CalendarDays,
  User,
  ArrowRight,
} from "lucide-react";

import { getAvisos } from "../../services/avisos.service";

import "./Avisos.css";

const categories = [
  { value: "todos", label: "Todos" },
  { value: "academico", label: "Académico" },
  { value: "eventos", label: "Eventos" },
  { value: "general", label: "General" },
  { value: "servicios", label: "Servicios" },
  { value: "otros", label: "Otros" },
];

const categoryLabels = {
  academico: "Académico",
  eventos: "Eventos",
  general: "General",
  servicios: "Servicios",
  otros: "Otros",
};

export default function Avisos() {
  const [avisos, setAvisos] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");

  const [loadingAvisos, setLoadingAvisos] = useState(true);
  const [error, setError] = useState("");

  const { isAdmin, loading } = useAuth();

  // Consultar los avisos del backend.
  const cargarAvisos = async () => {
    try {
      setLoadingAvisos(true);
      setError("");

      const response = await getAvisos();

      if (response.success === false) {
        throw new Error(
          response.message || "No fue posible obtener los avisos."
        );
      }

      setAvisos(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Error al cargar avisos:", err);

      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.message ||
        "No fue posible cargar los avisos."
      );
    } finally {
      setLoadingAvisos(false);
    }
  };

  useEffect(() => {
    cargarAvisos();
  }, []);

  // Aplicar búsqueda y filtros.
  const filteredAvisos = useMemo(() => {
    return avisos.filter((aviso) => {
      const matchesCategory =
        category === "todos" || aviso.category === category;

      const searchText = search.toLowerCase();

      const matchesSearch =
        String(aviso.title || "")
          .toLowerCase()
          .includes(searchText) ||
        String(aviso.content || "")
          .toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [avisos, category, search]);

  const formatDate = (date) => {
    if (!date) return "Fecha no disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Fecha no disponible";
    }

    return parsedDate.toLocaleDateString("es-MX", {
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

        {!loading && isAdmin && (
          <Link
            to="/avisos/crear"
            className="avisos-create-button"
          >
            <Plus size={19} />
            <span>Publicar aviso</span>
          </Link>
        )}
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

        {loadingAvisos ? (
          <div className="avisos-empty">
            <Megaphone size={35} />
            <h3>Cargando avisos...</h3>
            <p>Estamos consultando las publicaciones.</p>
          </div>
        ) : error ? (
          <div className="avisos-empty">
            <Megaphone size={35} />
            <h3>No fue posible cargar los avisos</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={cargarAvisos}
            >
              Intentar nuevamente
            </button>
          </div>
        ) : filteredAvisos.length === 0 ? (
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
                      <strong>
                        {aviso.author_name || "Comunidad ITC"}
                      </strong>

                      <small>
                        {aviso.control_number || aviso.author_email || ""}
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
