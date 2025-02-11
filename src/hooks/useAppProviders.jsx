// src/hooks/useAppProviders.js
import React from "react";
import { ClientProvider } from "../contexts/ClientContext";
import { ProjectProvider } from "../contexts/ProjectContext";
import { UserProvider } from "../contexts/UserContext";

export const useAppProviders = ({ children }) => {
  return (
    <UserProvider>
      <ProjectProvider>
        <ClientProvider>{children}</ClientProvider>
      </ProjectProvider>
    </UserProvider>
  );
};
