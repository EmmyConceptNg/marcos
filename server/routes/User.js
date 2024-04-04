import express from 'express';
import multer from 'multer'
import fs from 'fs'
import {
  login,
  register,
  resendMail,
  verifyMail,
  updateUser,
  loginGoogle,
  updateImage,
  updatePassword,
  updateId,
  updateProofOfAddress,
} from "../controllers/UserController.js";
import path from "path";
import { fileURLToPath } from "url";




const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); 
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using the original name and a timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "public", "images");


if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const upload = multer({ storage: storage });

router.post('/login', login);
router.post('/login/google', loginGoogle);
router.post('/register', register);

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
  "/upload-id/:userId",
  upload.single("idCard"),
  updateId
);
router.post(
  "/upload-address/:userId",
  upload.single("address"),
  updateProofOfAddress
);
// router.get('/image/:id', getImages)

export default router;
