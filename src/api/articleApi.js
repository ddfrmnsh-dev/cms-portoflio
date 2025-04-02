import axiosInstance from "./axiosInstance";

const articleApi = {
  getAllPost: (params = { page: 1, limit: 5 }) =>
    axiosInstance
      .get("/api/v1/post", { params })
      .then((response) => response.data),
  createPost: (postData) =>
    axiosInstance
      .post("/api/v1/post", postData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creating post:", error);
        throw error;
      }),
  updatePost: (id, updatedData) =>
    axiosInstance
      .put(`/api/v1/post/${id}`, updatedData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error updating post:", error);
        throw error;
      }),
  deletePost: (id) =>
    axiosInstance
      .delete(`/api/v1/post/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting post:", error);
        throw error;
      }),
  findPostById: (id) =>
    axiosInstance.get(`/api/v1/post/${id}`).then((response) => response.data),
  getAllCategory: () =>
    axiosInstance.get("/api/v1/category").then((response) => response.data),
};

export default articleApi;
