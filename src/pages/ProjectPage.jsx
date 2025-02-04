import Header from "../components/common/Header";

import PageWrapper from "./PageWrapper";
import ProjectsTable from "../components/projects/ProjectsTable";
const ProjectsPage = () => {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
        <Header title={"Projects"} />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* <OverviewCards />
          <RevenueChart /> */}

          <ProjectsTable />

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChannelPerformance />
            <ProductPerformance />
            <UserRetention />
            <CustomerSegmentation />
          </div>

          <AIPoweredInsights /> */}
        </main>
      </div>
    </PageWrapper>
  );
};
export default ProjectsPage;
