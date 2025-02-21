import { useContext, useEffect, useState } from "react";
import AddProjectModal from "./AddProjectModal";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { message, Form, Modal } from "antd";
import PaginationReusable from "../common/PanginationReusable";
import { ProjectContext } from "../../contexts/ProjectContext";
import UpdateProjectModal from "./UpdateProjectModal";

const ProjectsTable = () => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const {
    currentPage,
    projects,
    limit,
    setLimit,
    setCurrentPage,
    totalProject,
    findProjectByIds,
    selectedProject,
    deleteProject,
    setTotalProject,
    fetchProjects,
  } = useContext(ProjectContext);
  const [form] = Form.useForm();

  useEffect(() => {
    if (projects && Array.isArray(projects)) {
      setFilteredProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setLimit(limit);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(term)
    );

    setFilteredProjects(filtered);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showModalUpdate = async (projectId) => {
    form.resetFields();
    setIsModalUpdateVisible(true);
    setSelectedProjectId(projectId);

    await findProjectByIds(projectId);
  };

  const handleDelete = (projectId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProject(projectId);
          message.success("Project deleted successfully!");

          const newTotals = totalProject - 1;
          setTotalProject(newTotals);

          const maxPage = Math.ceil(newTotals / limit);

          if (currentPage > maxPage) {
            setCurrentPage(maxPage);
          } else if (newTotals < limit && currentPage > 1) {
            setCurrentPage(1);
          }

          fetchProjects(currentPage, limit);
        } catch (error) {
          message.error("Failed to delete project.");
        }
      },
    });
  };
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Projects</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-normal py-2 px-3 mb-2 rounded transition duration-200 sm:w-auto"
          onClick={showModal}
        >
          Add Project
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Client Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Demo Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredProjects.map((project) => (
            <motion.tr
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {project.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-100">
                      {project.name}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${
                    project?.client
                      ? "bg-green-800 text-green-100"
                      : "bg-blue-800 text-blue-100"
                  } text-blue-100`}
                >
                  {project?.client?.name ? project?.client?.name : "Personal"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-blue-100 hover:bg-white hover:text-black">
                  <a href={project?.linkWebsite} target="_blank">
                    {project?.linkWebsite}
                  </a>
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <button
                  className="text-indigo-400 hover:text-indigo-300 mr-2"
                  onClick={() => showModalUpdate(project.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(project?.id)}
                >
                  Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <PaginationReusable
        currentPage={currentPage}
        pageSize={limit}
        totalPages={totalProject}
        onPageChange={handlePageChange}
      />
      <AddProjectModal
        confirmLoad={confirmLoading}
        isOpen={isModalVisible}
        onCancel={handleCancel}
      />

      <UpdateProjectModal
        confirmLoad={confirmLoading}
        idProject={selectedProjectId}
        isOpen={isModalUpdateVisible}
        onCancel={() => setIsModalUpdateVisible(false)}
        projectData={selectedProject}
        form={form}
      />
    </motion.div>
  );
};

export default ProjectsTable;
