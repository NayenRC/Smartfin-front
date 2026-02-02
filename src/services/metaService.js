import api from "./api";

export const getMetas = async () => {
  const res = await api.get("/metas");
  return res.data;
};
