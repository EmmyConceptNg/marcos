import { useRoutes } from "react-router-dom";


import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Password from "../pages/auth/Email/Password";
import MailSent from "../pages/auth/Email/MailSent";
import ResetPassword from "../pages/auth/ResetPassword";
import ResetSuccess from "../pages/auth/ResetSuccess";
import VerificationLink from "../pages/auth/Email/VerificationLink";
import VerificationEmail from "../pages/auth/VerifyEmail";
import VerifiedSuccess from "../pages/auth/VerifiedSuccess";
import "react-toastify/dist/ReactToastify.css";

export const AuthRoutes = () => {
  return useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/reset-password/email", element: <Password /> },
    { path: "/reset-password/email/sent/:email", element: <MailSent /> },
    { path: "/reset-password/:email", element: <ResetPassword /> },
    { path: "/reset-password/:email/success", element: <ResetSuccess /> },
    { path: "/verification/link/:email", element: <VerificationLink /> },
    { path: "/verification/:email", element: <VerificationEmail /> },
    { path: "/verification/:email/verified", element: <VerifiedSuccess /> },

  ]);
};
