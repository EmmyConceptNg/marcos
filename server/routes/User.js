import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  login,
  register,
  resendMail,
  verifyMail,
  updateUser,
  loginGoogle,
  updateImage,
  updatePassword,
  updateDocument,
} from "../controllers/UserController.js";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "../public/images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/login", login);
router.post("/login/google", loginGoogle);
router.post("/register", register);

router.get("/email/resend/:email", resendMail);
router.post("/email/verify/:email", verifyMail);

router.post("/update/:userId", updateUser);
router.post("/update-password/:userId", updatePassword);
router.post(
  "/update-profile-image/:userId",
  upload.single("image"),
  updateImage
);
router.post(
  "/upload-documents/:userId",
  upload.single("document"),
  updateDocument
);

export default router;
