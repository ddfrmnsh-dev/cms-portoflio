import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
export const useAuth = () => {
  const { isAuthenticated, loading, login, logout, userInfo, isTokenExpired } =
    useContext(AuthContext);
  return { isAuthenticated, loading, login, logout, userInfo, isTokenExpired };
};
