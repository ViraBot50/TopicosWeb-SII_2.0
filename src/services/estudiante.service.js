import api from "./api";

export const getEstudiante = async () => {
  const response = await api.get("/movil/estudiante");

  if (!response.data?.flag) {
    throw new Error("No se pudieron obtener los datos del estudiante.");
  }

  return response.data.data;
};
