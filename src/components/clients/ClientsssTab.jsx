// import { useContext, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";
// import ModalReusable from "../common/ModalReusable";
// import {
//   Button,
//   Col,
//   Form,
//   Input,
//   message,
//   Row,
//   Pagination,
//   Modal,
//   Upload,
// } from "antd";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { encrypt } from "../../utils/cryptoUtils";
// import PaginationReusable from "../common/PanginationReusable";
// import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
// import { ClientContext } from "../../contexts/ClientContext";
// import UpdateClientModal from "./UpdateClientModal";

// const ClientsTable = () => {
//   const baseUrl = import.meta.env.VITE_BASE_URL;
//   const [form] = Form.useForm();
//   const [clientDatas, setClientDatas] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [selectedClientId, setSelectedClientId] = useState(null);
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const [limit, setLimit] = useState(5);
//   const [total, setTotal] = useState(0);
//   const [hasFetched, setHasFetched] = useState(false);
//   const [file, setFile] = useState(null);

//   const {
//     clients,
//     totalClient,
//     setTotalClient,
//     createClient,
//     deleteClient,
//     fetchClients,
//     currentPage,
//     setCurrentPage,
//     findClientById,
//     limit,
//     setLimit,
//   } = useContext(ClientContext);

//   // useEffect(() => {
//   //   fetchClients(currentPage, limit);
//   // }, [currentPage, limit, fetchClients]);

//   // const getClient = async (page = 1, limit = 5) => {
//   //   try {
//   //     const response = await axios.get(`${baseUrl}/api/v1/client`, {
//   //       headers: {
//   //         Authorization: Cookies.get("token"),
//   //       },
//   //       params: { page, limit },
//   //     });

//   //     setClientDatas(response.data.data.clients);
//   //     setTotal(response.data.data.total);

//   //     if (!hasFetched) {
//   //       message.success("Data’s locked and loaded!");
//   //       setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
//   //     }
//   //     setFilteredClients(response.data.data.clients);
//   //   } catch (error) {
//   //     console.log(error);
//   //     message.error("Uh-oh! Failed to fetch the data.");
//   //   }
//   // };

//   // useEffect(() => {
//   //   getClient(currentPage, limit);
//   // }, [currentPage, limit]);

//   useEffect(() => {
//     // Ketika clients berhasil dimuat, update filteredClients
//     if (clients && Array.isArray(clients)) {
//       setFilteredClients(clients); // Menampilkan semua client tanpa filter pada awalnya
//     }
//   }, [clients]);

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     const filtered =
//       clients && Array.isArray(clients)
//         ? clients.filter((client) => {
//             console.log(client?.name?.toLowerCase(), term); // Cek pencocokan nama
//             return client?.name?.toLowerCase().includes(term);
//           })
//         : [];

//     console.log("Filtered Clients:", filtered);
//     setFilteredClients(filtered);
//   };
//   // const handleSearch = (e) => {
//   //   const term = e.target.value.toLowerCase();
//   //   setSearchTerm(term);
//   //   const filtered = clients.filter((client) =>
//   //     client.name.toLowerCase().includes(term)
//   //   );
//   //   setFilteredClients(filtered);
//   // };

//   const showModal = () => {
//     form.resetFields();
//     setIsModalVisible(true);
//     console.log("true");
//   };

//   const onFinish = async (values) => {
//     console.log("Form Submitted:", values);
//     setConfirmLoading(true);

//     const formData = new FormData();
//     formData.append("name", values.name);
//     formData.append("img", file);

//     try {
//       const response = await createClient(formData);
//       // const response = await axios.post(`${baseUrl}/api/v1/client`, formData, {
//       //   headers: {
//       //     Authorization: Cookies.get("token"),
//       //     "Content-Type": "multipart/form-data",
//       //   },
//       // });
//       console.log("API Response User:", response);
//       setIsModalVisible(false);
//       setFile(null);
//       form.resetFields();

//       setConfirmLoading(false);
//       message.success("Yeay! You’re create client!");

//       fetchClients(currentPage, limit);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setConfirmLoading(false);
//       message.error("Failed create user. Please try again.");
//     }
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//     message.error(errorInfo?.errorFields[0]?.errors);
//   };

//   const handleFileChange = ({ file }) => {
//     setFile(file);
//   };

//   const handleCancel = () => {
//     console.log("Cancel clicked");
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const handlePageChange = (page, limit) => {
//     setCurrentPage(page);
//     setLimit(limit);
//     // getClient(page, limit);
//   };

//   const showModalUpdate = (clientId) => {
//     form.resetFields();
//     setIsModalVisibleUpdate(true);
//     setSelectedClientId(clientId);
//     findClientById(clientId);
//     console.log("seleectedddssss", selectedClientId);
//     console.log("cdkk id", clientId);
//   };

//   useEffect(() => {
//     console.log("selectedClientId updated:", selectedClientId);
//   }, [selectedClientId]);

//   const handleDelete = (clientId) => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this client?",
//       content: "This action cannot be undone.",
//       okText: "Yes, Delete",
//       cancelText: "Cancel",
//       onOk: async () => {
//         try {
//           const response = await axios.delete(
//             `${baseUrl}/api/v1/client/${clientId}`,
//             {
//               headers: {
//                 Authorization: Cookies.get("token"),
//               },
//             }
//           );

//           // Jika berhasil dihapus, tampilkan pesan sukses
//           message.success("Client deleted successfully!");

//           // Refresh data pengguna setelah penghapusan
//           // getClient(currentPage, limit);
//           const newTotals = totalClient - 1;
//           setTotalClient(newTotals);

//           const maxPage = Math.ceil(newTotals / limit);

//           if (currentPage > maxPage) {
//             setCurrentPage(maxPage);
//           } else if (newTotals < limit && currentPage > 1) {
//             setCurrentPage(1);
//           }

//           fetchClients(currentPage, limit);
//         } catch (error) {
//           // Tampilkan pesan error jika gagal
//           message.error("Failed to delete the client. Please try again.");
//         }
//       },
//       onCancel: () => {
//         console.log("Cancel delete");
//       },
//     });
//   };

//   return (
//     <motion.div
//       className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-100">Clients</h2>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search users..."
//             className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       <div className="grid grid-rows-[auto,1fr,auto] overflow-x-auto h-full">
//         <button
//           className="bg-indigo-600 hover:bg-indigo-700 text-white font-normal py-2 px-3 mb-2 rounded transition duration-200 w-full sm:w-auto justify-self-end"
//           onClick={showModal}
//         >
//           Add Client
//         </button>
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Logo
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Total Project
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             {filteredClients.map((client) => (
//               <motion.tr
//                 key={client.id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
//                         {client.name.charAt(0)}
//                       </div>
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-100">
//                         {client.name}
//                       </div>
//                     </div>
//                   </div>
//                 </td>

//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-300">
//                     <img
//                       src={`http://localhost:3000/${client.pathLogo}`}
//                       alt="Logo Client"
//                       className="h-10 w-10 rounded-sm"
//                       onError={(e) =>
//                         (e.target.src =
//                           "http://localhost:3000/broken-image.png")
//                       }
//                     />
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
//                     {client?._count?.project}
//                   </span>
//                 </td>

//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                   <button
//                     className="text-indigo-400 hover:text-indigo-300 mr-2"
//                     onClick={() => showModalUpdate(client.id)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="text-red-400 hover:text-red-300"
//                     onClick={() => handleDelete(client.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//         <PaginationReusable
//           currentPage={currentPage}
//           pageSize={limit}
//           totalPages={totalClient}
//           onPageChange={handlePageChange}
//         />

//         <UpdateClientModal
//           confirmLoad={confirmLoading}
//           idClient={selectedClientId}
//           isOpen={isModalVisibleUpdate}
//           onCancel={handleCancel}
//         />

//         <ModalReusable
//           title="Add New User"
//           open={isModalVisible}
//           //   onOk={handleOk}
//           onCancel={handleCancel}
//           okText="Confirm"
//           cancelText="Dismiss"
//           confirmLoading={confirmLoading}
//         >
//           <div style={{ maxWidth: 600, margin: "0 auto" }}>
//             <Form
//               form={form}
//               id="user-form" // Ensure this is the correct form ID
//               onFinish={onFinish}
//               onFinishFailed={onFinishFailed}
//               layout="vertical"
//               colon={false}
//             >
//               <Row gutter={16}>
//                 {/* Kolom pertama: Full Name dan Username */}
//                 <Col span={12}>
//                   <Form.Item
//                     label="Client Name"
//                     name="name"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please input client name!",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Enter client name" />
//                   </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                   <Form.Item
//                     label="Upload Logo"
//                     rules={[
//                       { required: true, message: "Please upload an image!" },
//                     ]}
//                   >
//                     <Upload
//                       beforeUpload={() => false} // Disable default upload behavior
//                       onChange={handleFileChange}
//                       //   fileList={fileList}
//                       maxCount={1}
//                     >
//                       <Button icon={<UploadOutlined />}>Select File</Button>
//                     </Upload>
//                   </Form.Item>
//                 </Col>
//               </Row>

//               <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
//                   Cancel
//                 </Button>
//                 <Button
//                   htmlType="submit"
//                   loading={confirmLoading}
//                   icon={confirmLoading ? <SyncOutlined spin /> : null}
//                   style={{
//                     backgroundColor: "#4f46e5",
//                     borderColor: "#4f46e5",
//                     color: "#ffffff",
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </div>
//             </Form>
//           </div>
//         </ModalReusable>
//       </div>
//     </motion.div>
//   );
// };
// export default ClientsTable;

// import { useContext, useEffect, useState } from "react";
// import ModalReusable from "../common/ModalReusable";
// import { ClientContext } from "../../contexts/ClientContext";

// const UpdateClientModal = ({ isOpen, onCancel, confirmLoad, idClient }) => {
//   const { findClientById, selectedClient } = useContext(ClientContext);
//   const [loading, setLoading] = useState(false);

//   // Tambahkan state untuk menyimpan data client
//   const [clientData, setClientData] = useState(null);

//   console.log("selecteddd", selectedClient);

//   const fetchClientId = async () => {
//     setLoading(true);
//     try {
//       console.log("idsss", idClient);
//       const response = await findClientById(idClient); // Pastikan idClient dipassing
//       setClientData(response); // Menyimpan hasil response ke state clientData
//       console.log("res client id", response.data);
//     } catch (error) {
//       console.error("Failed to fetch client id:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (idClient) {
//       fetchClientId(); // Mengambil data ketika idClient berubah atau modal dibuka
//     }
//   }, [idClient]); // Dependensi idClient agar fetch dijalankan ulang

//   return (
//     <ModalReusable
//       title="Update Client"
//       open={isOpen}
//       onCancel={onCancel}
//       okText="Confirm"
//       cancelText="Dismiss"
//       confirmLoading={confirmLoad || loading} // Loading jika ada proses confirm
//       sizeModal={800}
//     >
//       {/* Kamu bisa menambahkan form atau elemen lain untuk menampilkan data client */}
//       {clientData ? (
//         <div>
//           <p>Client Name: {clientData.name}</p>
//           <p>Client Email: {clientData.email}</p>
//           {/* Render field lainnya sesuai dengan struktur data client */}
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </ModalReusable>
//   );
// };

// export default UpdateClientModal;
