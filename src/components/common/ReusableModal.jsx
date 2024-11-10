import React from "react";
import { Modal, Button, theme, ConfigProvider } from "antd";
const ReusableModal = ({
  open,
  title,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  children,
  confirmLoading,
}) => {
  const { darkAlgorithm } = theme;
  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <Modal
        title={title}
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        footer={null}
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
};

export default ReusableModal;
