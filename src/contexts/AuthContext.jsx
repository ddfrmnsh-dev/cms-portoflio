import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const isTokenExpired = () => {
    const token = Cookies.get("token");
    if (!token) return true;

    try {
      const replaceToken = token.replace("Bearer", "");
      const decoded = jwtDecode(replaceToken);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to decode token", error);
      logout();
      return true;
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !isTokenExpired()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userInfo,
        login,
        logout,
        loading,
        isTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
