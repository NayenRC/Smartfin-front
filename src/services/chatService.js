import axios from "./axiosInstance";

export const getChatHistory = async () => {
  const res = await axios.get("/chat/history");
  return res.data;
};
