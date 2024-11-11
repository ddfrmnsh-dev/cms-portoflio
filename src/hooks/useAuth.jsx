import { useEffect, useState } from "react";
import Cookies from "js-cookie";
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = Cookies.get("token");
    console.log("status token", token);

    setIsAuthenticated(!!token);
    console.log("status auth", isAuthenticated);
  }, []);

  return isAuthenticated;
};
