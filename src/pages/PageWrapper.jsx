import React from "react";
import Sidebar from "../components/common/Sidebar"; // Pastikan pathnya sesuai dengan struktur projek Anda

const PageWrapper = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <Sidebar />
      {children}
      {/* Main Content */}
      {/* <div className="flex-1 relative z-10">{children}</div> */}
    </div>
  );
};

export default PageWrapper;
