// src/hooks/useAppProviders.js
import React from "react";
import { ClientProvider } from "../contexts/ClientContext";
import { ProjectProvider } from "../contexts/ProjectContext";

export const useAppProviders = ({ children }) => {
  return (
    <ProjectProvider>
      <ClientProvider>{children}</ClientProvider>
    </ProjectProvider>
  );
};
