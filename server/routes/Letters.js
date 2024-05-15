import express from 'express';
import { getLetters, createLetters, downloadAllLetters, mailOutLetters } from '../controllers/LettersController.js';

const router = express.Router();

router.get('/', getLetters);
router.post('/', createLetters);
router.get("/download-all/:userId", downloadAllLetters);
router.post("/mail-out", mailOutLetters);


// Add more routes as needed

export default router;
