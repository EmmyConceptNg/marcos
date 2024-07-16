import express from "express";
import {
  changeLanguage,
  rewrite,
  removeDocs,
} from "../controllers/UtilsController.js";

const router = express.Router();

router.post("/language", changeLanguage);
router.post("/rewrite", rewrite);
router.post("/remove-document", removeDocs);

export default router;
