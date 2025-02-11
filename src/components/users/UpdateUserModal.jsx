import { Button, Col, Form, Input, Row, message } from "antd";
import ModalReusable from "../common/ModalReusable";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { SyncOutlined } from "@ant-design/icons";
import { encrypt } from "../../utils/cryptoUtils";
import SelectReusable from "../common/SelectReusable";

const UpdateUserModal = ({
  confirmLoad,
  idUser,
  isOpen,
  onCancel,
  userData,
  form,
}) => {
  const [loading, setLoading] = useState(false); // state untuk loading button
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
    updateUser,
  } = useContext(UserContext);

  const listStatus = [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 0,
      label: "Inactive",
    },
  ];

  useEffect(() => {
    setStatusList(listStatus);
  }, []);

  const [statustList, setStatusList] = useState([]);
  const onFinish = async (values) => {
    console.log("check", values);
    setLoading(true);

    let encrptyPassword = encrypt(values.password);

    let newValues = {
      ...values,
      password: encrptyPassword,
    };

    try {
      await updateUser(idUser, newValues);

      setLoading(false);
      form.resetFields();

      await fetchUsers(currentPage, limit);

      onCancel();
      message.success("User updated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      message.error("Failed update user. Please try again.");
    }
  };

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        username: userData.username,
        profession: userData.profession,
        isActive: userData.isActive ? 1 : 0,
      });
    }
  }, [userData, form]);

  return (
    <ModalReusable
      title="Update User"
      open={isOpen}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Dismiss"
      confirmLoading={confirmLoad}
    >
      <Form
        form={form}
        id="user-form" // Ensure this is the correct form ID
        onFinish={onFinish}
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Status Account"
              name="isActive"
              rules={[
                {
                  required: false,
                  message: "Please input Client!",
                },
              ]}
            >
              {/* <Input placeholder="Enter Client" /> */}
              <SelectReusable
                options={statustList}
                loading={loading}
                placeholder="Select status type"
                value={form.getFieldValue("isActive")}
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
    </ModalReusable>
  );
};

export default UpdateUserModal;
