import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import ModalReusable from "../common/ModalReusable";
import { useContext, useEffect, useRef, useState } from "react";
import SelectReusable from "../common/SelectReusable";
import { UploadOutlined, SyncOutlined } from "@ant-design/icons";
import TinyEditor from "../common/TinyEditor";
import { ArticleContext } from "../../contexts/ArticleContext";
import { label } from "framer-motion/client";

const UpdateArticleModal = ({
  confirmLoad,
  idArticle,
  isOpen,
  onCancel,
  articleData,
  form,
}) => {
  const [editorContent, setEditorContent] = useState("");
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const lisenceKeyEditor = import.meta.env.VITE_LISENCE_KEY_TINYMCE;
  const editorRef = useRef(null);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [file, setFile] = useState([]);
  const [previewImage, setPreviewImage] = useState([null]);
  const [statustList, setStatusList] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);

  const { categories, updateArticle, fetchArticles, currentPage, limit } =
    useContext(ArticleContext);

  const listStatus = [
    {
      value: 1,
      label: "Published",
    },
    {
      value: 0,
      label: "Draft",
    },
  ];

  useEffect(() => {
    setStatusList(listStatus);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    const oldCategoryIds = articleData.categories.map((cat) => cat.category.id);
    const newCategoryIds = values.category.filter((val) => !isNaN(val));

    const removeCategoryIds = oldCategoryIds.filter(
      (id) => !newCategoryIds.includes(id)
    );

    const newCategoryLabels = values.category
      .filter((val) => isNaN(val))
      .map((label) => label.trim());

    const newData = {
      ...values,
      category: newCategoryIds,
      addCategory: newCategoryLabels,
      removeCategory: removeCategoryIds,
      removeImage: removeFiles,
    };

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("status", values.status);
    formData.append("content", editorContent);
    formData.append("addCategory", JSON.stringify(newData.addCategory));
    formData.append("removeCategory", JSON.stringify(newData.removeCategory));
    formData.append("removeImage", JSON.stringify(newData.removeImage));

    if (file !== null) {
      formData.append("img", file);
    }

    try {
      console.log("formData:", newData);
      await updateArticle(idArticle, formData);
      setLoading(false);
      message.success("Article updated successfully!");
      fetchArticles(currentPage, limit);
      onCancel();
    } catch (error) {
      console.log("err:", error);
      message.error("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFile(newFileList); // Simpan semua file yang dipilih
    const newPreviewImages = newFileList.map((file) =>
      file.url ? file.url : URL.createObjectURL(file.originFileObj)
    );

    setPreviewImage(newPreviewImages);
  };

  const handleRemoveImage = (index) => {
    setFile((prevFiles) => {
      const removedFile = prevFiles[index]; // Ambil file yang dihapus

      // Jika gambar dari backend (punya ID), tambahkan ID ke removeFiles hanya jika belum ada
      if (removedFile.id) {
        setRemoveFiles((prev) => {
          if (!prev.includes(removedFile.id)) {
            return [...prev, removedFile.id]; // Tambahkan hanya jika belum ada
          }
          return prev; // Jika sudah ada, tetap gunakan state lama
        });
      }

      return prevFiles.filter((_, i) => i !== index);
    });

    setPreviewImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleEditorChange = (content) => {
    console.log("Content was updated:", content);
    setEditorContent(content);
  };

  useEffect(() => {
    if (articleData) {
      const chekcCategories = articleData.categories.map((i) => ({
        label: i.category.name,
        value: i.category.id,
      }));

      console.log("articleData: Category", chekcCategories);
      form.setFieldsValue({
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        status: articleData.published ? 1 : 0,
        category: articleData.categories.map((item) => item.category.id), // Hanya ambil `value`
      });

      setEditorContent(articleData.content);

      if (articleData.image) {
        const imagesFromBackend = articleData.image.map((img, index) => ({
          id: img.id,
          url: `${baseURL}/${img.pathImg}`, // URL gambar dari backend
        }));

        setFile(imagesFromBackend);
        setPreviewImage(imagesFromBackend.map((img) => img.url)); // Untuk preview
      }
    }
  }, [articleData, form]);

  const options = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  useEffect(() => {
    setListCategory(options);
  }, [categories]);

  return (
    <ModalReusable
      title="Update Article"
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
                    message: "Please input meta descrription!",
                  },
                ]}
              >
                <TextArea rows={2} placeholder="Enter meta description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Status post" name="status">
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
                  value={form.getFieldValue("category")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Upload Image"
                name="img"
                rules={[
                  { required: false, message: "Please upload an image!" },
                ]}
              >
                <Upload
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  showUploadList={true}
                  fileList={file}
                  multiple
                >
                  <Button icon={<UploadOutlined />}>
                    {file ? "Change Image Featured" : "Select File"}
                  </Button>
                </Upload>
              </Form.Item>

              {previewImage.length > 0 && (
                <div className="mt-3">
                  <strong>Selected Images:</strong>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {/* {previewImage.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`preview-${index}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "5%",
                        }}
                      />
                    ))} */}
                    {previewImage.length > 0 && (
                      <div
                        className="image-preview-container"
                        style={{
                          display: "flex", // Gunakan flexbox
                          gap: "10px", // Jarak antar gambar
                          flexWrap: "wrap", // Supaya tetap rapi jika banyak gambar
                          marginTop: "10px",
                        }}
                      >
                        {previewImage.map((img, index) => (
                          <div
                            key={index}
                            className="image-preview"
                            style={{
                              display: "flex",
                              flexDirection: "column", // Tombol "Remove" tetap di bawah gambar
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={img}
                              alt={`Preview ${index}`}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: "5%",
                              }}
                            />
                            <Button
                              type="danger"
                              size="small"
                              onClick={() => handleRemoveImage(index)}
                              style={{ marginTop: 5 }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
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

export default UpdateArticleModal;
