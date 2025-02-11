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
  Upload,
} from "antd";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { ClientContext } from "../../contexts/ClientContext";
import UpdateClientModal from "./UpdateClientModal";
import PaginationReusable from "../common/PanginationReusable";

const ClientsTable = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  const {
    clients,
    totalClient,
    setTotalClient,
    fetchClients,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    findClientById,
    createClient,
    deleteClient,
    selectedClient,
  } = useContext(ClientContext);

  // Menyaring client berdasarkan pencarian
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(term)
    );

    setFilteredClients(filtered);
  };

  // Menampilkan modal untuk menambah client
  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showModalUpdate = async (clientId) => {
    form.resetFields();
    setIsModalVisibleUpdate(true);
    setSelectedClientId(clientId);

    // Ambil data client berdasarkan ID untuk diupdate
    await findClientById(clientId);
  };

  // Fungsi untuk menambahkan client
  const onFinish = async (values) => {
    setConfirmLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("img", file);

    try {
      await createClient(formData);
      setIsModalVisible(false);
      setFile(null);
      form.resetFields();
      setConfirmLoading(false);
      message.success("Client created successfully!");
      fetchClients(currentPage, limit);
    } catch (error) {
      setConfirmLoading(false);
      message.error("Failed to create client. Please try again.");
    }
  };

  // Handle pagination
  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setLimit(limit);
  };

  // Menghapus client
  const handleDelete = (clientId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this client?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteClient(clientId);
          message.success("Client deleted successfully!");

          const newTotals = totalClient - 1;
          setTotalClient(newTotals);

          const maxPage = Math.ceil(newTotals / limit);

          if (currentPage > maxPage) {
            setCurrentPage(maxPage);
          } else if (newTotals < limit && currentPage > 1) {
            setCurrentPage(1);
          }

          fetchClients(currentPage, limit);
        } catch (error) {
          message.error("Failed to delete client.");
        }
      },
    });
  };

  useEffect(() => {
    if (clients && Array.isArray(clients)) {
      setFilteredClients(clients);
    }
  }, [clients]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Clients</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
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
          Add Client
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Logo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Total Projects
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredClients && filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <motion.tr
                key={client?.id} // Menambahkan optional chaining untuk menghindari error jika client undefined
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {client?.name?.charAt(0)}{" "}
                        {/* Pastikan client dan name valid */}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {client?.name || "No Name"}{" "}
                        {/* Tampilkan fallback jika name tidak ada */}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={`http://localhost:3000/${client?.pathLogo}`}
                    alt="Logo Client"
                    className="h-10 w-10 rounded-sm"
                    onError={(e) =>
                      (e.target.src = "http://localhost:3000/broken-image.png")
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {client?._count?.project || 0}{" "}
                    {/* Menampilkan 0 jika tidak ada project */}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => showModalUpdate(client?.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(client?.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-400 py-4">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationReusable
        currentPage={currentPage}
        pageSize={limit}
        totalPages={totalClient}
        onPageChange={handlePageChange}
      />

      <UpdateClientModal
        confirmLoad={confirmLoading}
        idClient={selectedClientId}
        isOpen={isModalVisibleUpdate}
        onCancel={() => setIsModalVisibleUpdate(false)}
        clientData={selectedClient}
        form={form}
      />

      <ModalReusable
        title="Add New Client"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Confirm"
        cancelText="Dismiss"
        confirmLoading={confirmLoading}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" colon={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Client Name"
                name="name"
                rules={[
                  { required: true, message: "Please input client name!" },
                ]}
              >
                <Input placeholder="Enter client name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Upload Logo"
                rules={[{ required: true, message: "Please upload a logo!" }]}
              >
                <Upload
                  beforeUpload={() => false}
                  onChange={({ file }) => setFile(file)}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => setIsModalVisible(false)}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              loading={confirmLoading}
              icon={confirmLoading ? <SyncOutlined spin /> : null}
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
      </ModalReusable>
    </motion.div>
  );
};

export default ClientsTable;
