import express from 'express';
import { getCreditReport, createCreditReport, uploadRecord } from '../controllers/CreditReportController.js';
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();



const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const imagesDir = path.join(__dirname, "public", "records");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    callback(null, imagesDir); // Use the absolute path
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to check for PDF and HTML
const fileFilter = (req, file, callback) => {
  if (["application/pdf", "text/html"].includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Unsupported file type"), false);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "public", "records");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const upload = multer({ storage: storage, fileFilter: fileFilter });



router.get('/creditreport', getCreditReport);
router.post('/creditreport', createCreditReport);
router.post("/upload/:userId", upload.single("file"), uploadRecord);

export default router;
