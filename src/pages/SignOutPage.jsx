import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Sesuaikan dengan path useAuth kamu
import { message } from "antd";

const SignOutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Memanggil fungsi logout
    logout();

    message.info("You’re outta here! See ya!");
    // Redirect ke halaman login setelah logout
    navigate("/"); // Ganti '/login' dengan route login yang sesuai
    // setTimeout(() => {
    // }, 7000);
  }, [logout, navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default SignOutPage;
