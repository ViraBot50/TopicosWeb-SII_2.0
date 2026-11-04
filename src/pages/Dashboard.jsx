
import { useOutletContext } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { student } = useOutletContext();

  const stats = [
    {
      title: "Promedio general",
      value: Number(student.promedio_ponderado).toFixed(2),
      icon: Award,
      description: "Promedio ponderado",
    },
    {
      title: "Créditos acumulados",
      value: student.creditos_acumulados,
      icon: BookOpen,
      description: "Créditos obtenidos",
    },
    {
      title: "Materias cursadas",
      value: student.materias_cursadas,
      icon: GraduationCap,
      description: "Total de materias",
    },
    {
      title: "Avance académico",
      value: `${student.porcentaje_avance}%`,
      icon: TrendingUp,
      description: "Porcentaje del plan",
    },
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h2>
            ¡Bienvenido, {student.persona}!
          </h2>

          <p>
            Consulta tu información académica desde este panel.
          </p>
        </div>

        <span className="semester-badge">
          Semestre {student.semestre}
        </span>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-icon">
                <Icon size={23} />
              </div>

              <div>
                <span>{stat.title}</span>
                <h3>{stat.value}</h3>
                <small>{stat.description}</small>
              </div>
            </div>
          );
        })}
      </div>

      <section className="student-card">
        <h3>Información del estudiante</h3>

        <div className="student-details">
          <div>
            <span>Nombre completo</span>
            <strong>{student.persona}</strong>
          </div>

          <div>
            <span>Número de control</span>
            <strong>{student.numero_control}</strong>
          </div>

          <div>
            <span>Correo institucional</span>
            <strong>{student.email}</strong>
          </div>

          <div>
            <span>Materias aprobadas</span>
            <strong>{student.materias_aprobadas}</strong>
          </div>

          <div>
            <span>Materias reprobadas</span>
            <strong>{student.materias_reprobadas}</strong>
          </div>

          <div>
            <span>Créditos complementarios</span>
            <strong>{student.creditos_complementarios}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
