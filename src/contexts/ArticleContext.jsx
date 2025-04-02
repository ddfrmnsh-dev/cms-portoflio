import { createContext, useCallback, useEffect, useState } from "react";
import articleApi from "../api/articleApi";
import { message } from "antd";
import { useAuth } from "../hooks/useAuth";

export const ArticleContext = createContext();

export const ArticleProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalArticle, setTotalArticle] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [hasFetched, setHasFetched] = useState(false);
  const [apiMessage, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchArticles = useCallback(
    async (page = 1, limit = 5) => {
      try {
        const response = await articleApi.getAllPost({ page, limit });
        setArticles(response.data.articles);
        setTotalArticle(response.data.total);
        if (!hasFetched) {
          apiMessage.success("Data’s locked and loaded!");
          setHasFetched(true); // Update status hasFetched agar pesan tidak ditampilkan lagi
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    },
    [hasFetched]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await articleApi.getAllCategory();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, []);

  const createArticle = async (article) => {
    try {
      const response = await articleApi.createPost(article);
      if (!response.data || Object.keys(response.data).length === 0) {
        return;
      }

      setArticles((prevArticles) => [...prevArticles, response.data]);
    } catch (error) {
      console.log("Failed to create article:", error);
      throw error;
    }
  };

  const updateArticle = async (id, updatedArticle) => {
    try {
      await articleApi.updatePost(id, updatedArticle);
      setArticles(
        articles.map((article) =>
          article.id === id ? { ...article, ...updatedArticle } : article
        )
      );
    } catch (error) {
      console.log("Failed to update article:", error);
      throw error;
    }
  };
  const deleteArticle = async (id) => {
    try {
      await articleApi.deletePost(id);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.log("Failed to delete article:", error);
      throw error;
    }
  };
  const findArticleById = async (id) => {
    try {
      const response = await articleApi.findPostById(id);
      setSelectedArticle(response.data);
    } catch (error) {
      console.log("Failed to find article by ID:", error);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles(currentPage, limit).finally(() => setIsLoading(false));
      fetchCategories();
    }
  }, [isAuthenticated, currentPage, limit, fetchArticles, fetchCategories]);
  return (
    <ArticleContext.Provider
      value={{
        fetchArticles,
        fetchCategories,
        createArticle,
        findArticleById,
        setLimit,
        limit,
        setCurrentPage,
        currentPage,
        deleteArticle,
        updateArticle,
        articles,
        categories,
        totalArticle,
        setTotalArticle,
        isLoading,
        selectedArticle,
      }}
    >
      {contextHolder}
      {children}
    </ArticleContext.Provider>
  );
};
