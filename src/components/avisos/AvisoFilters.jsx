const categorias = [
  { value: "todos", label: "Todos" },
  { value: "academico", label: "Académico" },
  { value: "eventos", label: "Eventos" },
  { value: "comunidad", label: "Comunidad" },
  { value: "material_estudio", label: "Material de estudio" },
  { value: "otros", label: "Otros" },
];

export default function AvisoFilters({
  category,
  onCategoryChange,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categorias.map((item) => (
        <button
          key={item.value}
          onClick={() => onCategoryChange(item.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === item.value
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
