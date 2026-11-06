import api from "./api";

export const getAdmins = async () => {
  const { data } = await api.get("/admins");
  return data;
};

export const crearAdmin = async (email) => {
  const { data } = await api.post("/admins", { email });
  return data;
};

export const actualizarAdmin = async (id, cambios) => {
  const { data } = await api.patch(`/admins/${id}`, cambios);
  return data;
};

export const eliminarAdmin = async (id) => {
  const { data } = await api.delete(`/admins/${id}`);
  return data;
};