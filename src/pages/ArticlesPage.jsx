import Header from "../components/common/Header";
import ArticlesTable from "../components/articles/ArticlesTable";
import PageWrapper from "./PageWrapper";

const ArticlesPage = () => {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
        <Header title={"Articles"} />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <ArticlesTable />
        </main>
      </div>
    </PageWrapper>
  );
};

export default ArticlesPage;
