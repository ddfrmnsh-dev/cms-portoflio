import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import ModalReusable from "../common/ModalReusable";
import { useContext, useEffect, useRef, useState } from "react";
import { UploadOutlined, SyncOutlined } from "@ant-design/icons";
import SelectReusable from "../common/SelectReusable";
import TinyEditor from "../common/TinyEditor";
import { ClientContext } from "../../contexts/ClientContext";
import { ProjectContext } from "../../contexts/ProjectContext";

const UpdateProjectModal = ({
  confirmLoad,
  idProject,
  isOpen,
  onCancel,
  projectData,
  form,
}) => {
  const lisenceKeyEditor = import.meta.env.VITE_LISENCE_KEY_TINYMCE;
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { clients } = useContext(ClientContext);
  const [clientList, setClientList] = useState([]);
  const { currentPage, limit, updateProject, fetchProjects } =
    useContext(ProjectContext);

  const onFinish = async (values) => {
    console.log(values);

    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("link", values.link);
    formData.append("clientId", values.clientId);
    formData.append("description", editorRef.current?.getContent() || "");

    if (file !== null) {
      formData.append("img", file);
    }

    try {
      await updateProject(idProject, formData);
      message.success("Client updated successfully!");
      fetchProjects(currentPage, limit);
      onCancel();
    } catch (error) {
      console.log("err:", error);
      message.error("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectData) {
      form.setFieldsValue({
        name: projectData.name,
        link: projectData.linkWebsite,
        clientId: projectData.client?.id,
        description: projectData.description,
      });
      if (projectData.image && projectData.image.length > 0) {
        setPreviewImage(`${baseURL}/${projectData.image[0].pathImg}`);
      }
    }
  }, [projectData, form]);

  const handleFileChange = ({ file }) => {
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  useEffect(() => {
    const options = clients.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    setClientList(options);
  }, [clients]);

  return (
    <ModalReusable
      title="Update Project"
      open={isOpen}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Dismiss"
      confirmLoading={confirmLoad || loading} // Show spinner if loading
      onOk={() => form.submit()}
      sizeModal={800}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Form
          form={form}
          onFinish={onFinish}
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

          <Row gutter={16} align={"top"}>
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
                <SelectReusable
                  options={clientList}
                  loading={loading}
                  placeholder="Select client"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Upload Image Featured"
                name="image"
                rules={[
                  { required: false, message: "Please upload an image!" },
                ]}
              >
                <Upload
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>
                    {file ? "Change Image Featured" : "Select File"}
                  </Button>
                </Upload>
              </Form.Item>

              {previewImage && (
                <div className="mt-3">
                  <strong>Selected Image Featured: </strong>
                  <img
                    src={
                      typeof previewImage === "string"
                        ? previewImage
                        : URL.createObjectURL(previewImage)
                    }
                    alt="Selected Logo"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: "5%",
                    }}
                  />
                </div>
              )}
            </Col>
          </Row>

          <Row gutter={16}>
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
      </div>
    </ModalReusable>
  );
};

export default UpdateProjectModal;
