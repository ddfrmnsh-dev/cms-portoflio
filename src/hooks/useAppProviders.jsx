// src/hooks/useAppProviders.js
import React from "react";
import { ClientProvider } from "../contexts/ClientContext";
import { ProjectProvider } from "../contexts/ProjectContext";
import { UserProvider } from "../contexts/UserContext";
import { ArticleProvider } from "../contexts/ArticleContext";

export const useAppProviders = ({ children }) => {
  return (
    <ArticleProvider>
      <UserProvider>
        <ProjectProvider>
          <ClientProvider>{children}</ClientProvider>
        </ProjectProvider>
      </UserProvider>
    </ArticleProvider>
  );
};
