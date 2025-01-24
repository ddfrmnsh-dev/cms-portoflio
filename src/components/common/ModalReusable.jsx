import React from "react";
import { Modal, Button, theme, ConfigProvider } from "antd";

const ModalReusable = ({
  open,
  title,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  children,
  confirmLoading,
}) => {
  // const { darkAlgorithm } = theme;
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#006aff",
          colorInfo: "#006aff",
          colorBgBase: "#1f2937",
          colorText: "#ffffff",
          colorTextBase: "#ffffff",
          colorBorder: "#ffffff",
          colorBgContainer: "#374151",
          colorInfoText: "#ffffff",
          // borderRadius: 2,

          // Alias Token
          // colorBgContainer: "#006aff",
        },
        // algorithm: darkAlgorithm,
      }}
    >
      <Modal
        title={title}
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        footer={null}
        // style={{ backgroundColor: "#f0f2f5" }}
        // bodyProps={{ backgroundColor: "#fff", padding: 20 }}
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
};

export default ModalReusable;
