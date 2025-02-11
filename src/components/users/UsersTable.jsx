import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ModalReusable from "../common/ModalReusable";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Pagination,
  Modal,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { encrypt } from "../../utils/cryptoUtils";
import PaginationReusable from "../common/PanginationReusable";
import { SyncOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserContext } from "../../contexts/UserContext";
import AddUserModal from "./AddUserModal";
import UpdateUserModal from "./UpdateUserModal";

const UsersTable = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [form] = Form.useForm();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    users,
    findUserById,
    fetchUsers,
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    totalUser,
    setTotalUser,
    selectedUser,
    deleteUser,
  } = useContext(UserContext);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const showModalAdd = () => {
    setIsModalVisible(true);
  };

  const showModalEdit = async (userId) => {
    setIsModalVisibleUpdate(true);
    setSelectedUserId(userId);

    await findUserById(userId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setLimit(limit);
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUser(userId);

          message.success("User deleted successfully!");

          const newTotals = totalUser - 1;
          setTotalUser(newTotals);

          const maxPage = Math.ceil(newTotals / limit);

          if (currentPage > maxPage) {
            setCurrentPage(maxPage);
          } else if (newTotals < limit && currentPage > 1) {
            setCurrentPage(1);
          }

          fetchUsers(currentPage, limit);
        } catch (error) {
          message.error("Failed to delete the user. Please try again.");
        }
      },
      onCancel: () => {
        console.log("Cancel delete");
      },
    });
  };

  useEffect(() => {
    if (users && Array.isArray(users)) {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
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
          onClick={showModalAdd}
        >
          Add User
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Profession
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredUsers.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-100">
                      {user.name}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${
                    user.profession ? "bg-blue-800" : "bg-yellow-500"
                  } text-white`}
                >
                  {user.profession ? user.profession : "Not Set"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${
                    user.isActive === true
                      ? "bg-green-800 text-white"
                      : "bg-red-800 text-white"
                  }`}
                >
                  {user.isActive === true ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <button
                  className="text-indigo-400 hover:text-indigo-300 mr-2"
                  onClick={() => showModalEdit(user?.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(user.id)}
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
        totalPages={totalUser}
        onPageChange={handlePageChange}
      />

      <AddUserModal
        confirmLoad={confirmLoading}
        isOpen={isModalVisible}
        onCancel={handleCancel}
      />

      <UpdateUserModal
        confirmLoad={confirmLoading}
        isOpen={isModalVisibleUpdate}
        idUser={selectedUserId}
        onCancel={() => setIsModalVisibleUpdate(false)}
        userData={selectedUser}
        form={form}
      />
    </motion.div>
  );
};
export default UsersTable;
