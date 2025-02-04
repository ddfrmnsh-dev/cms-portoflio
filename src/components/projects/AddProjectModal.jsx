import { Button, Col, Form, Input, Row, Upload, message } from "antd";
import ModalReusable from "../common/ModalReusable";
import { useEffect, useRef, useState } from "react";
import TinyEditor from "../common/TinyEditor";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import SelectReusable from "../common/SelectReusable";
import axios from "axios";
import Cookies from "js-cookie";

const AddProjectModal = ({ isOpen, onCancel, confirmLoad }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const lisenceKeyEditor = import.meta.env.VITE_LISENCE_KEY_TINYMCE;
  const [editorContent, setEditorContent] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [file, setFile] = useState([]);
  const editorRef = useRef(null);

  const fetchClientList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/client`);
      const data = response.data.data.clients;

      const options = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setClientList(options);
    } catch (error) {
      console.error("Failed to fetch list client:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientList();
  }, []);

  const handleEditorChange = (content) => {
    console.log("Content was updated:", content);
    setEditorContent(content);
  };

  const handleFileChange = ({ file }) => {
    setFile(file.slice(-1));
  };

  const handleSubmit = async (values) => {
    console.log("Submitted values:", values);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("clientId", values.clientId);
    formData.append("description", editorRef.current?.getContent() || "");
    formData.append("link", values.link);
    formData.append("img", file);

    console.log("Form Data:", values.clientId);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/project`, formData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });

      console.log("API Response Project:", response);

      setLoading(false);
      form.resetFields();
      if (editorRef.current) {
        editorRef.current.setContent(""); // Reset TinyEditor
      }
      onCancel();
      message.success("Yeay! You’re create project!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      message.error("Failed create project. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo?.errorFields[0]?.errors);
  };

  return (
    <ModalReusable
      title="Add New Project"
      open={isOpen}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Dismiss"
      confirmLoading={confirmLoad}
      sizeModal={800}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Form
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout={"vertical"}
          initialValues={{ description: editorContent }}
          onValuesChange={(changedValues) => console.log(changedValues)}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name Project"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input project name!",
                  },
                ]}
              >
                <Input placeholder="Enter project name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Link Project"
                name="link"
                rules={[
                  {
                    required: true,
                    message: "Please input Link Project!",
                  },
                ]}
              >
                <Input placeholder="Enter Link Project" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Client Name"
                name="clientId"
                rules={[
                  {
                    required: false,
                    message: "Please input Client!",
                  },
                ]}
              >
                {/* <Input placeholder="Enter Client" /> */}
                <SelectReusable
                  options={clientList}
                  loading={loading}
                  placeholder="Select project type"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Upload Logo"
                name="image"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Upload
                  beforeUpload={() => false} // Disable default upload behavior
                  onChange={handleFileChange}
                  // fileList={file}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Kolom pertama: Full Name dan Username */}
            <Col span={24}>
              <Form.Item
                label="Description Project"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input description project!",
                  },
                ]}
              >
                <TinyEditor
                  onEditorInit={(editor) => (editorRef.current = editor)}
                  value="<p>This is the initial content of the editor</p>"
                  onChange={handleEditorChange}
                  height={400}
                  licenseKey={lisenceKeyEditor}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onCancel} style={{ marginRight: "8px" }}>
              Cancel
            </Button>
            <Button
              htmlType="submit"
              icon={loading ? <SyncOutlined spin /> : null}
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
    </ModalReusable>
  );
};

export default AddProjectModal;
