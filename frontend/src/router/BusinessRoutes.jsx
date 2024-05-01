import { Navigate, useRoutes } from "react-router-dom"
import DashboardLayout from "../components/layout/dashboard/Index";
import Settings from "../pages/settings/Index";
import Support from "../pages/support/Index";
import BusinessDashboard from "../pages/business/Index";
import Subscriptions from "../pages/business/Subscriptions/Index";
import Training from "../pages/business/Training/Index";
import Reports from "../pages/business/Reports/Index";
import Clients from "../pages/business/Clients/Index";
import ClientDetails from "../pages/business/Clients/Edit/Index";

export const BusinessRoutes = () =>{
    return [
      {
        path: "/business",
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="app" />, index: true },
          {
            path: "app",
            element: <BusinessDashboard />,
          },
          { path: "subscriptions", element: <Subscriptions /> },
          { path: "training", element: <Training /> },
          { path: "reports", element: <Reports /> },
          { path: "clients", element: <Clients /> },
          { path: "clients/:userId/edit", element: <ClientDetails /> },
          { path: "settings", element: <Settings /> },
          { path: "support", element: <Support /> },
        ],
      },
    ];
}