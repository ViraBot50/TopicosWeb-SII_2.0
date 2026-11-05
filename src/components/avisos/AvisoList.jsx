import AvisoCard from "./AvisoCard";

export default function AvisoList({ avisos, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl border p-5 animate-pulse"
          >
            <div className="h-5 w-24 bg-gray-200 rounded mb-5" />
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!avisos.length) {
    return (
      <div className="bg-white border border-dashed rounded-xl p-12 text-center">
        <div className="text-4xl mb-3">📢</div>

        <h3 className="font-semibold text-gray-800">
          No hay avisos disponibles
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Cuando se publiquen nuevos avisos aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {avisos.map((aviso) => (
        <AvisoCard key={aviso.id} aviso={aviso} />
      ))}
    </div>
  );
}
