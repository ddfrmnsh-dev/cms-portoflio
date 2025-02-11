import { param } from "framer-motion/client";
import axiosInstance from "./axiosInstance";

const userApi = {
  getAllUser: (params = { page: 1, limit: 5 }) =>
    axiosInstance
      .get("/api/v1/users", { params })
      .then((response) => response.data),
  findUserById: (id) =>
    axiosInstance.get(`/api/v1/user/${id}`).then((response) => response.data),
  createUser: (userData) =>
    axiosInstance
      .post("/api/v1/user", userData)
      .then((response) => response.data),
  updateUser: (id, updatedData) =>
    axiosInstance
      .put(`/api/v1/user/${id}`, updatedData)
      .then((response) => response.data),
  deleteUser: (id) =>
    axiosInstance
      .delete(`/api/v1/user/${id}`)
      .then((response) => response.data),
};

export default userApi;
