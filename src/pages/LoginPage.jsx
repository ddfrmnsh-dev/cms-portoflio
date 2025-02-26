import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { encrypt } from "../utils/cryptoUtils";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Helmet, HelmetProvider } from "react-helmet-async";

const LoginPage = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const onFinish = async (values) => {
    setConfirmLoading(true);
    let encrptyPassword = encrypt(values.password);

    let newValues = {
      ...values,
      password: encrptyPassword,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/adminSigninEnc`,
        newValues
      );
      console.log("API Response:", response);

      if (response.status === 200) {
        const { user, token } = response.data.data;

        login(user, token);
        navigate("/overview");
      }
      setConfirmLoading(false);
      message.success("Boom! You’re logged in!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setConfirmLoading(false);
      message.error("Failed login. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo?.errorFields[0]?.errors);
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("isauth", isAuthenticated);
      navigate("/overview");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {/* <HelmetProvider> */}
      <Helmet>
        <title>Login Page</title>
        <meta
          name="description"
          content="This is Login Page you can attack my website"
        />
      </Helmet>
      {/* </HelmetProvider> */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#039be5"
                d="M43 38c0 0 0-7.626 0-9.961C43 26.013 41 25 40.429 25 39.014 25 37 27.381 37 29.053V38H43zM5 38c0 0 0-7.626 0-9.961C5 26.013 7 25 7.571 25 8.986 25 11 27.381 11 29.053V38H5z"
              ></path>
              <path
                fill="#aed581"
                d="M13 24.54V29H5.63c-.08-.3-.15-.6-.21-.92h.01C5.17 26.78 5 25.31 5 23.65 5 21.88 6.54 21 8.43 21 10.31 21 13 23.08 13 24.54zM35 24.54V29h7.37c.08-.3.15-.6.21-.92h-.01c.26-1.3.43-2.77.43-4.43 0-1.77-1.54-2.65-3.43-2.65C37.69 21 35 23.08 35 24.54z"
              ></path>
              <path
                fill="#e7ebed"
                d="M39,9.8V29H9V9.8C9,7.112,10.65,5,12.75,5c1.8,0,3.257,1.546,3.654,3.667 c4.846-0.792,10.346-0.792,15.193,0.01C31.982,6.546,33.45,5,35.25,5C37.35,5,39,7.112,39,9.8z"
              ></path>
              <path
                fill="#ffccbc"
                d="M36 18.5c0 4.21-5.269 7.5-12 7.5s-12-3.29-12-7.5S17.269 11 24 11 36 14.29 36 18.5zM5 38H9V44H5zM39 38H43V44H39z"
              ></path>
              <g>
                <path
                  fill="#7cb342"
                  d="M13 29v2.62c0 .96 0 5.31 0 5.31s-1.71.44-3.43-.89C8.96 35.57 6.74 33.36 5.63 29H13zM35 29v2.62c0 .96 0 5.31 0 5.31s1.71.44 3.43-.89c.61-.47 2.83-2.68 3.94-7.04H35z"
                ></path>
              </g>
              <g>
                <path
                  fill="#212121"
                  d="M31 15A1 1 0 1 0 31 17 1 1 0 1 0 31 15zM17 15A1 1 0 1 0 17 17 1 1 0 1 0 17 15zM24.001 20c-1.736 0-3.347-.409-4.532-1.153-.468-.293-.609-.91-.316-1.378.295-.468.912-.608 1.379-.316C21.39 17.691 22.655 18 24.001 18c1.345 0 2.608-.309 3.469-.847.467-.293 1.085-.152 1.378.317.293.468.151 1.085-.317 1.378C27.345 19.591 25.735 20 24.001 20z"
                ></path>
              </g>
              <path
                fill="#29b6f6"
                d="M39,26v18H9V26l1.54,0.604c3.45,1.335,8.36,2.109,13.46,2.109s10.01-0.774,13.46-2.109L39,26z"
              ></path>
            </svg>
          </div>

          <Typography.Title level={2} className="text-center">
            Hey, dude! Log in to your account!
          </Typography.Title>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form
            name="loginForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            autoComplete="off"
            className="space-y-6"
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="link" href="#" className="float-right">
                Forgot password?
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                loading={confirmLoading}
                type="primary"
                htmlType="submit"
                className="w-full"
                style={{ backgroundColor: "#38bdf8", borderColor: "#38bdf8" }}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

// import React, { useContext, useEffect, useState } from "react";
// import { Form, Input, Button, Typography, message } from "antd";
// import { LockOutlined, MailOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { AuthContext } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { Helmet } from "react-helmet-async";
// import socket, { connectUser } from "../utils/socket"; // 🔥 Import socket
// import { encrypt } from "../utils/cryptoUtils";

// const LoginPage = () => {
//   const baseUrl = import.meta.env.VITE_BASE_URL;
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/overview");
//     }
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     // 📌 Menerima notifikasi real-time dari backend
//     socket.on("notification", (notif) => {
//       console.log("received", notif);
//       console.log("🔔 New Notification from WebSocket:", notif);
//       setNotifications((prev) => [...prev, notif]);
//       message.info(`🔔 Notifikasi: ${notif}`);
//     });

//     // return () => {
//     //   socket.off("notification");
//     // };
//   }, []);

//   const onFinish = async (values) => {
//     setConfirmLoading(true);
//     let encrptyPassword = encrypt(values.password);

//     let newValues = {
//       ...values,
//       password: encrptyPassword,
//     };
//     try {
//       const response = await axios.post(
//         `${baseUrl}/api/auth/adminSigninEnc`,
//         newValues
//       );

//       if (response.status === 200) {
//         const { user, token } = response.data.data;
//         login(user, token);
//         connectUser(user.id); // 🔥 Hubungkan WebSocket dengan userId
//         navigate("/overview");
//         message.success("Boom! You’re logged in!");
//       }
//     } catch (error) {
//       console.error("Login Error:", error);
//       message.error("Failed login. Please try again.");
//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Login Page</title>
//       </Helmet>
//       <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <Typography.Title level={2} className="text-center">
//             Hey, dude! Log in to your account!
//           </Typography.Title>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <Form name="loginForm" onFinish={onFinish} layout="vertical">
//             <Form.Item
//               label="Email Address"
//               name="email"
//               rules={[
//                 { required: true, message: "Please enter your email!" },
//                 { type: "email", message: "Please enter a valid email!" },
//               ]}
//             >
//               <Input prefix={<MailOutlined />} placeholder="Enter your email" />
//             </Form.Item>

//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[
//                 { required: true, message: "Please enter your password!" },
//               ]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="Enter your password"
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button
//                 loading={confirmLoading}
//                 type="primary"
//                 htmlType="submit"
//                 className="w-full"
//                 style={{ backgroundColor: "#38bdf8", borderColor: "#38bdf8" }}
//               >
//                 Sign in
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>

//         {/* 🔔 List Notifikasi */}
//         <div>
//           <h3>🔔 Notifikasi:</h3>
//           <ul>
//             {notifications.map((notif, index) => (
//               <li key={index}>{notif}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;
