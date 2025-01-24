import Header from "../components/common/Header";

import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import ProductPerformance from "../components/analytics/ProductPerformance";
import UserRetention from "../components/analytics/UserRetention";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import PageWrapper from "./PageWrapper";
import ClientsTable from "../components/clients/ClientsTable";

const ClientsPage = () => {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
        <Header title={"Clients"} />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* <OverviewCards />
          <RevenueChart /> */}

          <ClientsTable />

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
export default ClientsPage;
