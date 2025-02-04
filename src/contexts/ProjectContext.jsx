import { useEffect, createContext, useState, useCallback } from "react";
import projectClient from "../api/projectApi";
import { message } from "antd";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
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
        const response = await projectClient.getAllProject({ page, limit });
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

  useEffect(() => {
    fetchProjects(currentPage, limit); // Call fetchProjects with the current page and limit
  }, [currentPage, limit, fetchProjects, hasFetched]);
  return (
    <ProjectContext.Provider
      value={{
        projects,
        limit,
        setLimit,
        setCurrentPage,
        currentPage,
        totalProject,
      }}
    >
      {contextHolder}
      {children}
    </ProjectContext.Provider>
  );
};
