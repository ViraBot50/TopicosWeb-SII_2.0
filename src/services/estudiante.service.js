import api from "./api";

export const getEstudiante = async () => {
  const { data } = await api.get("/academico/perfil");
  return data.data;
};

export const getCalificaciones = async () => {
  const { data } = await api.get("/academico/calificaciones");
  return data.data;
};

export const getKardex = async () => {
  const { data } = await api.get("/academico/kardex");
  return data.data;
};

export const getHorarios = async () => {
  const { data } = await api.get("/academico/horarios");
  return data.data;
};
