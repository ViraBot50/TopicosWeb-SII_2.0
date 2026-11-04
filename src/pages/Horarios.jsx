import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import api from "../services/api";
import Loading from "../components/Loading";

const DIAS = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
];

export default function Horarios() {
  const [horario, setHorario] = useState([]);
  const [periodo, setPeriodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const response = await api.get("/movil/estudiante/horarios");

        if (!response.data?.flag) {
          throw new Error("No se pudo obtener el horario.");
        }

        const actual = response.data.data?.[0];

        setHorario(actual?.horario ?? []);
        setPeriodo(actual?.periodo ?? null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Error al cargar el horario."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarHorario();
  }, []);

  if (loading) return <Loading message="Cargando horario..." />;

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="academic-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">ORGANIZACIÓN ACADÉMICA</span>
          <h1>Horario escolar</h1>
          <p>Distribución semanal de tus clases.</p>
        </div>

        <div className="page-heading-icon">
          <CalendarDays size={26} />
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
          <strong>{horario.length}</strong>
        </div>
      </section>

      <section className="panel schedule-panel">
        <div className="panel-title">
          <div>
            <Clock size={19} />
            <h2>Distribución semanal</h2>
          </div>
        </div>

        <div className="schedule-scroll">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="schedule-time-header">Materia</th>
                {DIAS.map((dia) => (
                  <th key={dia.key}>{dia.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {horario.map((materia) => (
                <tr key={materia.id_grupo}>
                  <td className="schedule-subject">
                    <strong>{materia.nombre_materia}</strong>
                    <span>{materia.clave_materia}</span>
                    <small>Grupo {materia.letra_grupo}</small>
                  </td>

                  {DIAS.map((dia) => {
                    const hora = materia[dia.key];
                    const salon = materia[`${dia.key}_clave_salon`];

                    return (
                      <td key={dia.key}>
                        {hora ? (
                          <div className="schedule-class">
                            <strong>{hora}</strong>
                            <span>
                              {salon || "Salón pendiente"}
                            </span>
                          </div>
                        ) : (
                          <span className="schedule-empty">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {horario.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No hay clases registradas para este periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}