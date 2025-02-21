import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import PageWrapper from "./PageWrapper";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { message } from "antd";

const OverviewPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (notif) => {
      console.log("🔔 New Notification:", notif);
      console.log("🔔 New Notification from WebSocket:", notif);
      setNotifications(notif);
      message.info(`🔔 Notifikasi: ${notif}`);
    });

    // return () => {
    //   socket.off("notification");
    // };
  }, []);

  console.log("notipp", notifications);
  return (
    <PageWrapper title={"Overview Page"}>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Overview" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <div>
            <h3>🔔 Notifikasi:</h3>
            <ul>
              {notifications.map((notif, index) => (
                <li key={index}>{notif}</li>
              ))}
            </ul>
          </div>
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Sales"
              icon={Zap}
              value="$12,345"
              color="#6366F1"
            />
            <StatCard
              name="New Users"
              icon={Users}
              value="1,234"
              color="#8B5CF6"
            />
            <StatCard
              name="Total Products"
              icon={ShoppingBag}
              value="567"
              color="#EC4899"
            />
            <StatCard
              name="Conversion Rate"
              icon={BarChart2}
              value="12.5%"
              color="#10B981"
            />
          </motion.div>

          {/* CHARTS */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesOverviewChart />
            <CategoryDistributionChart />
            <SalesChannelChart />
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};
export default OverviewPage;
