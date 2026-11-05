import api from "./api";

export const getAvisos = async (params = {}) => {
  const { data } = await api.get("/avisos", { params });
  return data;
};

export const getAviso = async (id) => {
  const { data } = await api.get(`/avisos/${id}`);
  return data;
};

export const crearAviso = async (aviso) => {
  const { data } = await api.post("/avisos", aviso);
  return data;
};

export const actualizarAviso = async (id, aviso) => {
  const { data } = await api.patch(`/avisos/${id}`, aviso);
  return data;
};

export const eliminarAviso = async (id) => {
  const { data } = await api.delete(`/avisos/${id}`);
  return data;
};

export const getMisAvisos = async (params = {}) => {
  const { data } = await api.get("/avisos/mis-avisos", { params });
  return data;
};
