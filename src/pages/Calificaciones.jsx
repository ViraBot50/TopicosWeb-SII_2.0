import { useEffect, useState } from "react";
import { BookOpen, ClipboardList } from "lucide-react";
import api from "../services/api";
import Loading from "../components/Loading";

export default function Calificaciones() {
  const [periodo, setPeriodo] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCalificaciones = async () => {
      try {
        const response = await api.get(
          "/movil/estudiante/calificaciones"
        );

        if (!response.data?.flag) {
          throw new Error("No se pudieron obtener las calificaciones.");
        }

        const periodoActual = response.data.data?.[0];

        setPeriodo(periodoActual?.periodo ?? null);
        setMaterias(periodoActual?.materias ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Error al cargar las calificaciones."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarCalificaciones();
  }, []);

  if (loading) return <Loading message="Cargando calificaciones..." />;

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="academic-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">RENDIMIENTO ACADÉMICO</span>
          <h1>Calificaciones</h1>
          <p>Consulta tus resultados por materia y parcial.</p>
        </div>

        <div className="page-heading-icon">
          <ClipboardList size={26} />
        </div>
      </div>

      <section className="academic-summary">
        <div>
          <span>Periodo escolar</span>
          <strong>
            {periodo?.descripcion_periodo || "Sin información"}
          </strong>
        </div>

        <div>
          <span>Materias inscritas</span>
          <strong>{materias.length}</strong>
        </div>
      </section>

      <section className="panel academic-table-panel">
        <div className="panel-title">
          <div>
            <BookOpen size={19} />
            <h2>Resultados por materia</h2>
          </div>
          <span className="table-count">
            {materias.length} materias
          </span>
        </div>

        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Materia</th>
                <th>Clave</th>
                <th>Grupo</th>
                <th>Parcial 1</th>
                <th>Parcial 2</th>
                <th>Parcial 3</th>
                <th>Parcial 4</th>
              </tr>
            </thead>

            <tbody>
              {materias.map((item) => {
                const materia = item.materia;
                const calificaciones = item.calificaiones || [];

                return (
                  <tr key={materia.id_grupo}>
                    <td className="subject-cell">
                      <strong>{materia.nombre_materia}</strong>
                    </td>

                    <td>
                      <span className="subject-code">
                        {materia.clave_materia}
                      </span>
                    </td>

                    <td>{materia.letra_grupo}</td>

                    {[1, 2, 3, 4].map((numero) => {
                      const parcial = calificaciones.find(
                        (c) => c.numero_calificacion === numero
                      );

                      const valor = parcial?.calificacion;

                      return (
                        <td key={numero}>
                          {valor !== null && valor !== undefined ? (
                            <span
                              className={`grade-value ${
                                Number(valor) >= 70
                                  ? "grade-approved"
                                  : "grade-failed"
                              }`}
                            >
                              {valor}
                            </span>
                          ) : (
                            <span className="grade-pending">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {materias.length === 0 && (
          <p className="empty-state">
            No hay calificaciones disponibles para este periodo.
          </p>
        )}
      </section>

      <div className="grade-legend">
        <span><i className="legend-dot approved"></i> Aprobatoria</span>
        <span><i className="legend-dot failed"></i> No aprobatoria</span>
        <span><i className="legend-dot pending"></i> Sin calificación</span>
      </div>
    </div>
  );
}