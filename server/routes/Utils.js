import express from "express";
import { changeLanguage } from "../controllers/UtilsController.js";

const router = express.Router();

router.post("/language", changeLanguage);

export default router;
