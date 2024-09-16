import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";
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
  verifySSN,
  deductBalance,
} from "../controllers/UserController.js";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "../public/images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage: storage });

const processImage = async (buffer, filename, destination) => {
  try {
    const outputPath = path.join(destination, filename);
    await sharp(buffer)
      .resize({ width: 800 }) // Resize to a reasonable width while maintaining aspect ratio
      .jpeg({ quality: 50 }) // Compress the image to 50% quality
      .toBuffer()
      .then(async (data) => {
        // Ensure the size is under 1MB
        if (data.length > 1024 * 1024) {
          // Further compress if over 1MB
          await sharp(data).jpeg({ quality: 30 }).toFile(outputPath);
        } else {
          // Directly save the image if it's under 1MB
          await sharp(data).toFile(outputPath);
        }
      });
    return outputPath;
  } catch (err) {
    console.error("Error processing image:", err);
    throw new Error("Failed to process the image");
  }
};

const imageProcessingMiddleware = (req, res, next) => {
  if (!req.file) return next();

  const { buffer, originalname } = req.file;
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename =
    req.file.fieldname + "-" + uniqueSuffix + path.extname(originalname);

  processImage(buffer, filename, imagesDir)
    .then((outputPath) => {
      req.file.path = outputPath;
      req.file.filename = filename; // Ensure filename is set for controller use
      next();
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Failed to process the image", error: err.message });
    });
};

router.post("/login", login);
router.post("/login/google", loginGoogle);
router.post("/register", register);
router.post("/verify-ssn", verifySSN);
router.post("/deduct-balance", deductBalance);

router.get("/email/resend/:email", resendMail);
router.post("/email/verify/:email", verifyMail);

router.post("/update/:userId", updateUser);
router.post("/update-password/:userId", updatePassword);
router.post(
  "/update-profile-image/:userId",
  upload.single("image"),
  imageProcessingMiddleware,
  updateImage
);
router.post(
  "/upload-documents/:userId",
  upload.single("document"),
  imageProcessingMiddleware,
  updateDocument
);

export default router;
