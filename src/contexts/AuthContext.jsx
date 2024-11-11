import React, { createContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUserInfo(userData);

    Cookies.set("token", token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);

    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
