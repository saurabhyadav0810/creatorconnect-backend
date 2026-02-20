import axiosInstance from "./axiosInstance";

export const createAsset = async (payload) => {
  const res = await axiosInstance.post("/assets", payload);
  return res.data;
};

export const getMyAssets = async () => {
  const res = await axiosInstance.get("/assets/my");
  return res.data;
};

export const getPublicAssets = async () => {
  const res = await axiosInstance.get("/assets/public");
  return res.data;
};
