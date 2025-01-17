import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ReusableModal from "../common/ReusableModal";
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

const UsersTable = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [form] = Form.useForm();
  const [userDatas, setUserDatas] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  const getUser = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/users`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
        params: { page, limit },
      });

      setUserDatas(response.data.data.user);
      setTotal(response.data.data.total);

      console.log("TOTAL", total);
      console.log("RES", response.data);
      // message.success("Data’s locked and loaded!");
      if (!hasFetched) {
        message.success("Data’s locked and loaded!");
        setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
      }
      // message.info(response.data.meta.message);
      setFilteredUsers(response.data.data.user);
    } catch (error) {
      console.log(error);
      message.error("Uh-oh! Failed to fetch the data.");
    }
  };

  useEffect(() => {
    getUser(currentPage, limit);
  }, [currentPage, limit]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userDatas.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
    console.log("true");
  };

  // Form submission handler
  const onFinish = async (values) => {
    console.log("Form Submitted:", values);
    setConfirmLoading(true);

    let encrptyPassword = encrypt(values.Password);

    let newValues = {
      ...values,
      password: encrptyPassword,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/v1/user`, newValues, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
      console.log("API Response User:", response);
      setIsModalVisible(false);

      setConfirmLoading(false);
      message.success("Yeay! You’re create user!");

      await getUser(currentPage, limit);
    } catch (error) {
      console.error("Error submitting form:", error);
      setConfirmLoading(false);
      message.error("Failed create user. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo?.errorFields[0]?.errors);
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    setIsModalVisible(false);
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page); // Update halaman
    setLimit(limit); // Update limit
    getUser(page, limit); // Panggil API dengan page dan limit yang baru
  };
  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `${baseUrl}/api/v1/user/${userId}`,
            {
              headers: {
                Authorization: Cookies.get("token"),
              },
            }
          );

          // Jika berhasil dihapus, tampilkan pesan sukses
          message.success("User deleted successfully!");

          // Refresh data pengguna setelah penghapusan
          getUser(currentPage, limit);
        } catch (error) {
          // Tampilkan pesan error jika gagal
          message.error("Failed to delete the user. Please try again.");
        }
      },
      onCancel: () => {
        console.log("Cancel delete");
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

      <div className="grid grid-rows-[auto,1fr,auto] overflow-x-auto h-full">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-normal py-2 px-3 mb-2 rounded transition duration-200 w-full sm:w-auto justify-self-end"
          onClick={showModal}
        >
          Add User
        </button>
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
                Role
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
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {user.email}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active === true
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {user.is_active === true ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
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
        <Pagination
          current={currentPage}
          pageSize={limit}
          total={total}
          onChange={handlePageChange}
        />

        <ReusableModal
          title="Add New User"
          open={isModalVisible}
          //   onOk={handleOk}
          onCancel={handleCancel}
          okText="Confirm"
          cancelText="Dismiss"
          confirmLoading={confirmLoading}
        >
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Form
              form={form}
              id="user-form" // Ensure this is the correct form ID
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              colon={false}
            >
              <Row gutter={16}>
                {/* Kolom pertama: Full Name dan Username */}
                <Col span={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your full name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your username" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                {/* Kolom kedua: Email dan Password */}
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter your password" />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={confirmLoading}
                  style={{
                    backgroundColor: "#4f46e5",
                    borderColor: "#4f46e5",
                    color: "#ffffff",
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </ReusableModal>
      </div>
    </motion.div>
  );
};
export default UsersTable;
