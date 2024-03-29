import { Navigate, useRoutes } from "react-router-dom"
import Dashboard from "../pages/dashboard/Index";
import DashboardLayout from "../components/layout/dashboard/Index";
import Settings from "../pages/settings/Index";
import DisputeCenters from "../pages/dashboard/DisputeCenters/Index";
import CreditReport from "../pages/dashboard/CreditReport/Index";
import Deals from "../pages/dashboard/Deals/Index";
import Learn from "../pages/dashboard/Learn/Index";
import Support from "../pages/support/Index";
import SubscriptionSuccess from "../pages/dashboard/Subscription/SubscriptionSuccess";

export const DashboardRoutes = () =>{
    return useRoutes([
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="app" />, index: true },
          {
            path: "app",
            element: <Dashboard />,
          },
          { path: "dispute-center", element: <DisputeCenters /> },
          { path: "credit-report", element: <CreditReport /> },
          { path: "deals", element: <Deals /> },
          { path: "learn", element: <Learn /> },
          { path: "settings", element: <Settings /> },
          { path: "support", element: <Support /> },
          { path: "subscription/success/:sessionId/:planId", element: <SubscriptionSuccess /> },
        ],
      },
    ]);
}