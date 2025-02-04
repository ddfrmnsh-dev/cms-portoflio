import axiosInstance from "./axiosInstance";

const clientApi = {
  getAllClient: (params = { page: 1, limit: 5 }) =>
    axiosInstance
      .get("/api/v1/client", { params })
      .then((response) => response.data),
  createClient: (clientData) =>
    axiosInstance
      .post("/api/v1/client", clientData)
      .then((response) => response.data),
  updateClient: (id, updatedData) =>
    axiosInstance
      .put(`/api/v1/client/${id}`, updatedData)
      .then((response) => response.data),
  deleteClient: (id) =>
    axiosInstance
      .delete(`/api/v1/client/${id}`)
      .then((response) => response.data),
  findClientById: (id) =>
    axiosInstance.get(`/api/v1/client/${id}`).then((response) => response.data),
};

export default clientApi;
