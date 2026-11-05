
import { Link } from "react-router-dom";

const categorias = {
  academico: {
    label: "Académico",
    color: "bg-blue-100 text-blue-700",
  },
  eventos: {
    label: "Eventos",
    color: "bg-purple-100 text-purple-700",
  },
  comunidad: {
    label: "Comunidad",
    color: "bg-green-100 text-green-700",
  },
  material_estudio: {
    label: "Material de estudio",
    color: "bg-orange-100 text-orange-700",
  },
  otros: {
    label: "Otros",
    color: "bg-gray-100 text-gray-700",
  },
};

export default function AvisoCard({ aviso }) {
  const categoria =
    categorias[aviso.category] || categorias.otros;

  const fecha = new Date(aviso.created_at);

  const fechaTexto = fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${categoria.color}`}
        >
          {categoria.label}
        </span>

        <span className="text-xs text-gray-400">
          {fechaTexto}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {aviso.title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {aviso.content}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {aviso.author_name}
          </p>

          <p className="text-xs text-gray-400">
            {aviso.control_number || aviso.author_email}
          </p>
        </div>

        <Link
          to={`/avisos/${aviso.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Ver aviso →
        </Link>
      </div>
    </article>
  );
}
