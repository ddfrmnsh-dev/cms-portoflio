import { useEffect, createContext, useState, useCallback } from "react";
import projectApi from "../api/projectApi";
import { message } from "antd";
import { useAuth } from "../hooks/useAuth";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [totalProject, setTotalProject] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedProject, setSelectedProject] = useState(null);
  const [apiMessage, contextHolder] = message.useMessage();
  const [hasFetched, setHasFetched] = useState(false);

  const fetchProjects = useCallback(
    async (page = 1, limit = 5) => {
      try {
        const response = await projectApi.getAllProject({ page, limit });
        setProjects(response.data.projects);
        setTotalProject(response.data.total);
        if (!hasFetched) {
          apiMessage.success("Data’s locked and loaded!");
          setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    },
    [hasFetched]
  );

  const createProject = async (project) => {
    try {
      const response = await projectApi.createProject(project);
      setProjects([...projects, response.data]);
    } catch (error) {
      console.log("Failed to create project:", error);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      await projectApi.updateProject(id, updatedProject);
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, ...updatedProject } : project
        )
      );
    } catch (error) {
      console.log("Failed to update project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectApi.deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.log("Failed to delete project:", error);
    }
  };

  const findProjectByIds = async (id) => {
    try {
      const response = await projectApi.findProjectById(id);
      setSelectedProject(response.data);
    } catch (error) {
      console.log("Failed to fetch project:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects(currentPage, limit); // Call fetchProjects with the current page and limit
    }
  }, [isAuthenticated, currentPage, limit, fetchProjects, hasFetched]);
  return (
    <ProjectContext.Provider
      value={{
        projects,
        limit,
        setLimit,
        setCurrentPage,
        currentPage,
        totalProject,
        createProject,
        updateProject,
        deleteProject,
        findProjectByIds,
        selectedProject,
        fetchProjects,
        setTotalProject,
      }}
    >
      {contextHolder}
      {children}
    </ProjectContext.Provider>
  );
};
