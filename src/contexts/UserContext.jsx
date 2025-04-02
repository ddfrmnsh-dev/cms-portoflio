import { createContext, useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { useAuth } from "../hooks/useAuth";
import userApi from "../api/userApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated, isTokenExpired } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [apiMessage, contextHolder] = message.useMessage();
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(
    async (page = 1, limit = 5) => {
      if (!isAuthenticated) return;

      try {
        const response = await userApi.getAllUser({ page, limit });
        console.log("response", response);
        setUsers(response.data.user);
        setTotalUser(response.data.total);

        if (!hasFetched) {
          apiMessage.success("Data’s locked and loaded!");
          setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
        }
      } catch (error) {
        isTokenExpired();
        apiMessage.error("Uh-oh! Failed to fetch the data.");
        console.error("Failed to fetch users:", error);
      }
    },
    [isAuthenticated, hasFetched]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers(currentPage, limit);
    }
  }, [isAuthenticated, currentPage, limit, fetchUsers, hasFetched]);

  const createUser = async (user) => {
    try {
      const response = await userApi.createUser(user);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const findUserById = async (id) => {
    try {
      const res = await userApi.findUserById(id);
      setSelectedUser(res.data);
    } catch (error) {
      console.error("Failed to find client:", error);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      await userApi.updateUser(id, updatedUser);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await userApi.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        totalUser,
        setTotalUser,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        fetchUsers,
        createUser,
        findUserById,
        selectedUser,
        updateUser,
        deleteUser,
      }}
    >
      {contextHolder}
      {children}
    </UserContext.Provider>
  );
};
