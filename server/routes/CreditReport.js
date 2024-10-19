import express from "express";
import {
  getCreditReport,
  createCreditReport,
  uploadRecord,
} from "../controllers/CreditReportController.js";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();

// Get __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Use process.cwd() to get the root directory of your project
    const imagesDir = path.join(process.cwd(), "public", "records");

    // Ensure the directory exists, if not create it
    if (!fs.existsSync(imagesDir)) {
      try {
        fs.mkdirSync(imagesDir, { recursive: true });
      } catch (err) {
        console.error("Error creating directory: ", err);
        return callback(new Error("Could not create directory"), false);
      }
    }

    console.log("Saving file to directory:", imagesDir); // Debugging log
    callback(null, imagesDir);
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname;
    console.log("Generated file name:", filename); // Debugging log
    callback(null, filename);
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

// Set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("file");

// Routes
router.get("/creditreport", getCreditReport);
router.post("/creditreport", createCreditReport);
// router.post("/upload/:userId", upload.single("file"), uploadRecord);
router.post("/upload/:userId", upload, (req, res, next) => {
  // Log file information to check if multer is receiving the file
  console.log("File received: ", req.file);

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // If file is successfully uploaded, you can process it further
  uploadRecord(req, res);
});


export default router;
