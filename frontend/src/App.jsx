import { ToastContainer } from "react-toastify";
import { AuthRoutes } from "./router/AuthRoutes"
import { BusinessRoutes } from "./router/BusinessRoutes"
import { DashboardRoutes } from "./router/DashboardRoutes"
import { HomeRoutes } from "./router/HomeRoutes"


function App() {
  return (
    <>
      <ToastContainer />
      <HomeRoutes />
      <AuthRoutes />
      <DashboardRoutes />
      <BusinessRoutes />
    </>
  );
}

export default App
