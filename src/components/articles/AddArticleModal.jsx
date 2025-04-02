import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import ModalReusable from "../common/ModalReusable";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import SelectReusable from "../common/SelectReusable";
import TinyEditor from "../common/TinyEditor";
import { ArticleContext } from "../../contexts/ArticleContext";

const AddArticleModal = ({ isOpen, onCancel, confirmLoad, form }) => {
  const lisenceKeyEditor = import.meta.env.VITE_LISENCE_KEY_TINYMCE;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);
  // const [form] = Form.useForm();
  const editorRef = useRef(null);
  const [file, setFile] = useState([]);
  const [statustList, setStatusList] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const { TextArea } = Input;

  const { categories, createArticle, fetchArticles, currentPage, limit } =
    useContext(ArticleContext);

  const options = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  useEffect(() => {
    setListCategory(options);
  }, [categories]);

  const listStatusPublished = [
    {
      label: "Published",
      value: 1,
    },
    {
      label: "Draft",
      value: 0,
    },
  ];

  const handleFileChange = ({ fileList }) => {
    console.log("File:", fileList);
    // setFile(file.slice(-1));
    setFile(fileList);
  };

  const handleCategoryChange = (selectedValues) => {
    setListCategory((prev) => {
      // Pastikan kategori baru tidak ada di prev
      const newCategories = selectedValues
        .filter((val) => !prev.some((c) => String(c.value) === String(val)))
        .map((val) => ({ label: val, value: val }));

      const updatedCategories = [...prev, ...newCategories];

      // Set value form ke kategori yang sudah dipilih
      form.setFieldsValue({ category: selectedValues });

      return updatedCategories;
    });
  };

  const handleFinish = async (values) => {
    const selectedCategoryLabels = Array.isArray(values.category)
      ? values.category.map((val) => {
          const foundCategory = listCategory.find(
            (c) => String(c.value) === String(val)
          );
          return foundCategory ? foundCategory.label : val;
        })
      : typeof values.category === "string"
      ? values.category.split(",").map((c) => c.trim()) // Jika string, ubah jadi array
      : [];

    const formData = {
      ...values,
      category: selectedCategoryLabels,
    };

    const formDatas = new FormData();
    formDatas.append("title", formData.title);
    formDatas.append("description", formData.description);
    formDatas.append("status", formData.status);
    formDatas.append("category", JSON.stringify(formData.category));
    formDatas.append("content", editorRef.current?.getContent() || "");
    formDatas.append("img", file[0].originFileObj);

    try {
      await createArticle(formDatas);

      setLoading(false);

      form.resetFields();
      if (editorRef.current) {
        editorRef.current.setContent("");
      }

      await fetchArticles(currentPage, limit);
      onCancel();
      message.success("Yeay! You’re create post!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      message.error("Failed create post. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo?.errorFields[0]?.errors);
  };

  const handleEditorChange = (content) => {
    console.log("Content was updated:", content);
    setEditorContent(content);
  };

  useEffect(() => {
    setStatusList(listStatusPublished);
  }, []);
  return (
    <ModalReusable
      title="Add New Article"
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
          onFinish={handleFinish}
          onFinishFailed={onFinishFailed}
          layout={"vertical"}
          initialValues={{ description: editorContent }}
          onValuesChange={(changedValues) => console.log(changedValues)}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Title Post"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input title post!",
                  },
                ]}
              >
                <Input placeholder="Enter title post" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Meta Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input meta description!",
                  },
                ]}
              >
                <TextArea rows={2} placeholder="Enter meta description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Status Post" name="status">
                <SelectReusable
                  options={statustList}
                  loading={loading}
                  placeholder="Select status post"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category Post"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input category post!",
                  },
                ]}
              >
                <SelectReusable
                  options={listCategory}
                  loading={loading}
                  placeholder="Select category post"
                  mode={"tags"}
                  onChange={handleCategoryChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Upload Image"
                name="img"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Upload
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  fileList={file}
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Content Post"
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Please input content post!",
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

export default AddArticleModal;
