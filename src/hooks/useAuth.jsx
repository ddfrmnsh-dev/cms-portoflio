import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
export const useAuth = () => {
  // const { isAuthenticated } = useContext(AuthContext);
  // return isAuthenticated;
  const { isAuthenticated, loading, login, logout } = useContext(AuthContext);
  return { isAuthenticated, loading, login, logout };
};
