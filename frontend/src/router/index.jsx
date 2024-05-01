import { useRoutes } from "react-router-dom"
import { HomeRoutes } from "./HomeRoutes"
import { DashboardRoutes } from "./DashboardRoutes";
import { BusinessRoutes } from "./BusinessRoutes";
import { AuthRoutes } from "./AuthRoutes";

export const Routes = () => {
     return useRoutes([...HomeRoutes(), ...DashboardRoutes(), ...BusinessRoutes(), ...AuthRoutes()]);
}