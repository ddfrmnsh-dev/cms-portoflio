import { createContext, useCallback, useEffect, useState } from "react";
import clientApi from "../api/clientApi";
import { message } from "antd";
import { useAuth } from "../hooks/useAuth";

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [clients, setClients] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [totalClient, setTotalClient] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedClient, setSelectedClient] = useState(null);
  const [apiMessage, contextHolder] = message.useMessage();

  // Fetch users on mount
  // const fetchClients = async (page = 1, limit = 5) => {
  //   try {
  //     const response = await clientApi.getAllClient({ page, limit });
  //     setClients(response.data.data.clients);
  //     setTotalClient(response.data.data.total);

  //     if (!hasFetched) {
  //       message.success("Data’s locked and loaded!");
  //       setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch clients:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchClients(currentPage, limit); // Call fetchClients with the current page and limit
  // }, [currentPage, limit]);

  const fetchClients = useCallback(
    async (page = 1, limit = 5) => {
      if (!isAuthenticated) return;

      try {
        const response = await clientApi.getAllClient({ page, limit });
        setClients(response.data.clients);
        setTotalClient(response.data.total);

        if (!hasFetched) {
          apiMessage.success("Data’s locked and loaded!");
          setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    },
    [isAuthenticated, hasFetched]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients(currentPage, limit);
    }
  }, [isAuthenticated, currentPage, limit, fetchClients, hasFetched]);
  // useEffect(() => {
  //   const fetchClients = async (page = 1, limit = 5) => {
  //     try {
  //       const response = await clientApi.getAllClient({ page, limit });
  //       setClients(response.data.data.clients);
  //       setTotalClient(response.data.data.total);

  //       if (!hasFetched) {
  //         message.success("Data’s locked and loaded!");
  //         setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch clients:", error);
  //     }
  //   };
  //   fetchClients(currentPage, limit);
  // }, [currentPage, limit]);

  const createClient = async (client) => {
    try {
      const response = await clientApi.createClient(client);
      setClients([...clients, response.data]);
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  // Update User
  const updateUser = async (id, updatedClient) => {
    try {
      await clientApi.updateClient(id, updatedClient);
      setUsers(
        clients.map((client) =>
          client.id === id ? { ...client, ...updatedClient } : client
        )
      );
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  const deleteClient = async (id) => {
    try {
      await clientApi.deleteClient(id);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const findClientById = async (id) => {
    try {
      const res = await clientApi.findClientById(id);
      setSelectedClient(res.data);
    } catch (error) {
      console.error("Failed to find client:", error);
    }
  };
  return (
    <ClientContext.Provider
      value={{
        clients,
        totalClient,
        createClient,
        deleteClient,
        fetchClients,
        findClientById,
        selectedClient,
        currentPage,
        setCurrentPage,
        setTotalClient,
        limit,
        setLimit,
      }}
    >
      {contextHolder}
      {children}
    </ClientContext.Provider>
  );
};
