import axiosInstance from "./axiosInstance";

const projectApi = {
  getAllProject: (params = { page: 1, limit: 5 }) =>
    axiosInstance
      .get("/api/v1/project", { params })
      .then((response) => response.data),
  createProject: (projectData) =>
    axiosInstance
      .post("/api/v1/project", projectData)
      .then((response) => response.data),
  updateProject: (id, updatedData) =>
    axiosInstance
      .put(`/api/v1/project/${id}`, updatedData)
      .then((response) => response.data),
  deleteProject: (id) =>
    axiosInstance
      .delete(`/api/v1/project/${id}`)
      .then((response) => response.data),
  findProjectById: (id) =>
    axiosInstance
      .get(`/api/v1/project/${id}`)
      .then((response) => response.data),
};

export default projectApi;
