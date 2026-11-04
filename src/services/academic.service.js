import api from "./api";

export const getCalificaciones = async () => {
  const response = await api.get("/movil/estudiante/calificaciones");
  return response.data.data;
};

export const getKardex = async () => {
  const response = await api.get("/movil/estudiante/kardex");
  return response.data.data;
};

export const getHorarios = async () => {
  const response = await api.get("/movil/estudiante/horarios");
  return response.data.data;
};