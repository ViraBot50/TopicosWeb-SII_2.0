
import api, { setAuthToken } from "./api";

export const login = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password,
  });

  const data = response.data;
  const token = data.message?.login?.token;

  if (data.flag !== "success" || !token) {
    throw new Error(
      "No fue posible autenticar al estudiante."
    );
  }

  setAuthToken(token);

  return data;
};

export const logout = () => {
  setAuthToken(null);
};
