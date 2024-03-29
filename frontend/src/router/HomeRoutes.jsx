import { useRoutes } from "react-router-dom"
import Dashboard from "../pages/dashboard/Index";
import Home from "../pages/home/Index";
import Components from "../components/Index";

export const HomeRoutes = () =>{
    return useRoutes([
      { path: "/", element: <Home /> },
      { path: "/components", element: <Components /> },
    ]);
}