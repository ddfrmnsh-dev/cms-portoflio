import { Route, Routes } from "react-router-dom";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import NotFoundPage from "./pages/NotFoundPage";
import SignOutPage from "./pages/SignOutPage";
import ClientsPage from "./pages/ClientPage";
import ProjectsPage from "./pages/ProjectPage";
import { useAppProviders } from "./hooks/useAppProviders";
function App() {
  const Providers = useAppProviders;
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/overview"
          element={<PrivateRoute component={OverviewPage} />}
        />
        {/* <Route
        path="/products"
        element={<PrivateRoute component={ProductsPage} />}
      /> */}
        <Route
          path="/projects"
          element={<PrivateRoute component={ProjectsPage} />}
        />
        <Route path="/users" element={<PrivateRoute component={UsersPage} />} />
        {/* <Route path="/sales" element={<PrivateRoute component={SalesPage} />} /> */}
        <Route
          path="/articles"
          element={<PrivateRoute component={SalesPage} />}
        />
        <Route
          path="/orders"
          element={<PrivateRoute component={OrdersPage} />}
        />
        {/* <Route
        path="/analytics"
        element={<PrivateRoute component={AnalyticsPage} />}
      /> */}
        <Route
          path="/clients"
          element={<PrivateRoute component={ClientsPage} />}
        />
        <Route
          path="/settings"
          element={<PrivateRoute component={SettingsPage} />}
        />
        <Route
          path="/signout"
          element={<PrivateRoute component={SignOutPage} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Providers>
  );
}

export default App;
