import express from 'express';
import {
  login,
  register,
  resendMail,
  verifyMail,
  updateUser,
  loginGoogle,
} from "../controllers/UserController.js";

const router = express.Router();

router.post('/login', login);
router.post('/login/google', loginGoogle);
router.post('/register', register);

router.get("/email/resend/:email", resendMail);
router.post("/email/verify/:email", verifyMail);

router.post("/update/:userId", updateUser);

export default router;
