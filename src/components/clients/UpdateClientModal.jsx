import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Modal, Row, Col } from "antd";
import { UploadOutlined, SyncOutlined } from "@ant-design/icons";
import ModalReusable from "../common/ModalReusable";

const UpdateClientModal = ({
  confirmLoad,
  idClient,
  isOpen,
  onCancel,
  clientData,
  onUpdateClient,
  form,
}) => {
  const [file, setFile] = useState(null); // state untuk logo yang baru di-upload
  const [loading, setLoading] = useState(false); // state untuk loading button

  // Set field values saat clientData diupdate
  useEffect(() => {
    if (clientData) {
      form.setFieldsValue({
        name: clientData.name,
        img: clientData.pathLogo,
      });
      setFile(null); // Reset file jika ada perubahan
    }
  }, [clientData, form]);

  // Handle file upload
  const handleFileChange = ({ file }) => {
    if (file.status === "done") {
      setFile(file.originFileObj);
    }
  };

  // Form submission for updating the client
  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);

    // If there's a file uploaded, append it to FormData
    if (file) {
      formData.append("img", file);
    }

    try {
      await onUpdateClient(idClient, formData); // Call the function to update client
      message.success("Client updated successfully!");
      onCancel(); // Close the modal after successful update
    } catch (error) {
      message.error("Failed to update client. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <ModalReusable
      title="Update Client"
      open={isOpen}
      onCancel={onCancel}
      okText="Update"
      cancelText="Cancel"
      confirmLoading={confirmLoad || loading} // Show spinner if loading
      onOk={() => form.submit()}
      sizeModal={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical" colon={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Client Name"
              name="name"
              rules={[
                { required: true, message: "Please input the client name!" },
              ]}
            >
              <Input placeholder="Enter client name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Logo">
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                onChange={handleFileChange} // Handle file change
                showUploadList={false} // Hide the default file list
              >
                <Button icon={<UploadOutlined />}>
                  {file ? "Change Logo" : "Select Logo"}
                </Button>
              </Upload>
            </Form.Item>

            {file && (
              <div className="mt-3">
                <strong>Selected Logo: </strong>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected Logo"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              </div>
            )}
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onCancel}
            style={{ marginRight: "8px" }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            loading={loading}
            icon={loading ? <SyncOutlined spin /> : null}
            style={{
              backgroundColor: "#4f46e5",
              borderColor: "#4f46e5",
              color: "#ffffff",
            }}
          >
            Update
          </Button>
        </div>
      </Form>
    </ModalReusable>
  );
};

export default UpdateClientModal;
