import { Button, Col, Form, Input, message, Row } from "antd";
import ModalReusable from "../common/ModalReusable";
import { UserContext } from "../../contexts/UserContext";
import { useContext, useState } from "react";
import { encrypt } from "../../utils/cryptoUtils";
import { SyncOutlined } from "@ant-design/icons";

const AddUserModal = ({ isOpen, onCancel, confirmLoad }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    users,
    createUser,
    fetchUsers,
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    totalUser,
    setTotalUser,
  } = useContext(UserContext);

  const onFinish = async (values) => {
    console.log("Form Submitted:", values);
    setLoading(true);

    let encrptyPassword = encrypt(values.password);

    let newValues = {
      ...values,
      password: encrptyPassword,
    };

    try {
      await createUser(newValues);

      setLoading(false);
      form.resetFields();

      await fetchUsers(currentPage, limit);

      onCancel();
      message.success("Yeay! You’re create user!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      message.error("Failed create user. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo?.errorFields[0]?.errors);
  };

  return (
    <ModalReusable
      title="Add New User"
      open={isOpen}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Dismiss"
      confirmLoading={confirmLoad}
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
                label="Profession"
                name="profession"
                rules={[
                  { required: true, message: "Please input your profession!" },
                ]}
              >
                <Input placeholder="Enter your profession" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: false,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="password2"
                dependencies={["password"]}
                rules={[
                  {
                    required: false,
                    message: "Please input your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Enter your password" />
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

export default AddUserModal;
