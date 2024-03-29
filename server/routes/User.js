import express from 'express';
import {
  login,
  register,
  resendMail,
  verifyMail,
  updateUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.get("/email/resend/:email", resendMail);
router.post("/email/verify/:email", verifyMail);

router.post("/update/:userId", updateUser);

export default router;
