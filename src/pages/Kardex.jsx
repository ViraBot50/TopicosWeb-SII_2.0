import { useEffect, useState } from "react";
import { getKardex } from "../services/academic.service";

export default function Kardex() {
  const [kardex, setKardex] = useState([]);
  const [avance, setAvance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarKardex = async () => {
      try {
        const data = await getKardex();

        setKardex(data.kardex || []);
        setAvance(data.porcentaje_avance || 0);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el kardex.");
      } finally {
        setLoading(false);
      }
    };

    cargarKardex();
  }, []);

  if (loading) return <p className="loading">Cargando kardex...</p>;
  if (error) return <p className="error">{error}</p>;

  const semestres = [...new Set(kardex.map((materia) => materia.semestre))]
    .sort((a, b) => a - b);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h1>Kardex académico</h1>
          <p>Historial de materias cursadas.</p>
        </div>
      </div>

      <section className="progress-card">
        <div className="section-title">
          <h2>Avance de créditos</h2>
          <strong>{avance}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${avance}%` }}
          />
        </div>
      </section>

      {semestres.map((semestre) => {
        const materiasSemestre = kardex.filter(
          (materia) => materia.semestre === semestre
        );

        return (
          <section className="academic-section" key={semestre}>
            <h2>Semestre {semestre}</h2>

            <div className="table-container">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th>Clave</th>
                    <th>Periodo</th>
                    <th>Créditos</th>
                    <th>Calificación</th>
                    <th>Tipo</th>
                  </tr>
                </thead>

                <tbody>
                  {materiasSemestre.map((materia, index) => (
                    <tr key={`${materia.clave_materia}-${index}`}>
                      <td>{materia.nombre_materia}</td>
                      <td>{materia.clave_materia}</td>
                      <td>{materia.periodo}</td>
                      <td>{materia.creditos}</td>
                      <td>
                        <strong
                          className={
                            !isNaN(Number(materia.calificacion)) &&
                            Number(materia.calificacion) < 70
                              ? "grade-failed"
                              : "grade-approved"
                          }
                        >
                          {materia.calificacion}
                        </strong>
                      </td>
                      <td>{materia.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}