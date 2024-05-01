import { ToastContainer } from "react-toastify";
import { AuthRoutes } from "./router/AuthRoutes";
import { BusinessRoutes } from "./router/BusinessRoutes";
import { DashboardRoutes } from "./router/DashboardRoutes";
import { HomeRoutes } from "./router/HomeRoutes";
import { useCallback, useEffect, useState } from "react";
import { clearUser } from "./redux/UserReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes } from "./router";

const INACTIVITY_THRESHOLD = 3 * 60 * 1000; // 5 minutes

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track the last activity timestamp
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleLogout = useCallback(() => {
    localStorage.setItem("lastUrl", window.location.pathname);
    dispatch(clearUser());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];

    const checkIdleTime = () => {
      if (Date.now() - lastActivity >= INACTIVITY_THRESHOLD) {
        handleLogout();
      }
    };

    // Check inactivity by setting an interval
    const intervalId = setInterval(checkIdleTime, 1000);

    // Attach activity event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      // Clear the interval and event listeners on cleanup
      clearInterval(intervalId);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [lastActivity, handleActivity, handleLogout]);

  return (
    <>
      <ToastContainer />
      <Routes />
    </>
  );
}

export default App;
