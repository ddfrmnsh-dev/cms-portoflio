import { Form, message, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { ArticleContext } from "../../contexts/ArticleContext";
import PaginationReusable from "../common/PanginationReusable";
import UpdateArticleModal from "./UpdateArticleModal";
import AddArticleModal from "./AddArticleModal";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { excerptByWord } from "../../utils/globalFunction";
import { id } from "date-fns/locale";
import { format, parseISO } from "date-fns";
const ArticlesTable = () => {
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const {
    currentPage,
    articles,
    limit,
    setLimit,
    setCurrentPage,
    totalArticle,
    findArticleById,
    selectedArticle,
    deleteArticle,
    setTotalArticle,
    fetchArticles,
  } = useContext(ArticleContext);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setLimit(limit);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    // Filter articles berdasarkan title
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(term)
    );

    // Format tanggal untuk setiap artikel dalam hasil filter
    const formattedArticles = filtered.map((article) => ({
      ...article,
      createdAt: format(new Date(article.createdAt), "dd MMM yyyy", {
        locale: id,
      }),
    }));

    setFilteredArticles(formattedArticles);
  };

  const showModalUpdate = async (articleId) => {
    form.resetFields();
    setIsModalUpdateVisible(true);
    setSelectedArticleId(articleId);

    await findArticleById(articleId);
  };
  // useEffect(() => {
  //   if (articles && Array.isArray(articles)) {
  //     const formattedArticles = articles.map((article) => ({
  //       ...article,
  //       createdAt: format(new Date(article.createdAt), "d MMM yyyy", {
  //         locale: id,
  //       }),
  //     }));

  //     setFilteredArticles(formattedArticles);
  //   }
  // }, [articles]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // useEffect(() => {
  //   if (articles && Array.isArray(articles)) {
  //     const formattedArticles = articles.map((article) => {
  //       try {
  //         const dateObj = article.createdAt
  //           ? parseISO(article.createdAt) // Konversi ke format yang bisa dibaca
  //           : null;

  //         return {
  //           ...article,
  //           createdAt: dateObj
  //             ? format(dateObj, "d MMM yyyy", { locale: id })
  //             : "-",
  //         };
  //       } catch (error) {
  //         console.error("Date parsing error:", error);
  //         return { ...article, createdAt: "-" }; // Handle error agar tidak blank
  //       }
  //     });

  //     setFilteredArticles(formattedArticles);
  //   }
  // }, [articles]);

  useEffect(() => {
    if (articles && Array.isArray(articles)) {
      const filtered = articles
        .filter((article) => article.title) // Hapus artikel tanpa title
        .map((article) => ({
          ...article,
          createdAt: article.createdAt
            ? format(new Date(article.createdAt), "d MMM yyyy", { locale: id })
            : "-",
        }));

      setFilteredArticles(filtered);
    }
  }, [articles]);

  const handleDelete = (articleId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this article?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteArticle(articleId);
          message.success("Project deleted successfully!");

          const newTotals = totalArticle - 1;
          setTotalArticle(newTotals);

          const maxPage = Math.ceil(newTotals / limit);

          if (currentPage > maxPage) {
            setCurrentPage(maxPage);
          } else if (newTotals < limit && currentPage > 1) {
            setCurrentPage(1);
          }

          fetchArticles(currentPage, limit);
        } catch (error) {
          console.log(error);
          message.error("Failed to delete article.");
        }
      },
    });
  };
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Articles</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-normal py-2 px-3 mb-2 rounded transition duration-200 sm:w-auto"
          onClick={showModal}
        >
          Add Article
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Desc Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredArticles.map((article) => (
              <motion.tr
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {article.title ? article.title.charAt(0) : "?"}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100 truncate">
                        {excerptByWord(article.title, 20)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-normal break-words max-w-xs truncate">
                  <div className="text-sm font-medium text-gray-100">
                    {excerptByWord(article.description, 20)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-100">
                    {article.createdAt}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      article?.published
                        ? "bg-green-800 text-green-100"
                        : "bg-yellow-600 text-blue-100"
                    } text-blue-100`}
                  >
                    {article?.published ? "Published" : "Draft"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-100 flex flex-wrap items-center gap-1">
                    {article?.categories?.length > 0 ? (
                      article.categories.map((i, index) => (
                        <span
                          key={`${i.category.id}-${index}`}
                          className="px-2 py-0.5 inline-block text-xs font-semibold text-white bg-blue-600 rounded-sm"
                        >
                          {i.category.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">Tidak ada kategori</p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => showModalUpdate(article.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(article?.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationReusable
        currentPage={currentPage}
        pageSize={limit}
        totalPages={totalArticle}
        onPageChange={handlePageChange}
      />

      <AddArticleModal
        confirmLoad={confirmLoading}
        isOpen={isModalVisible}
        onCancel={handleCancel}
        form={form}
      />

      <UpdateArticleModal
        confirmLoad={confirmLoading}
        idArticle={selectedArticleId}
        isOpen={isModalUpdateVisible}
        onCancel={() => setIsModalUpdateVisible(false)}
        articleData={selectedArticle}
        form={form}
      />
    </motion.div>
  );
};

export default ArticlesTable;
