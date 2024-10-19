import express from 'express';
import { getLetters, createLetters, downloadAllLetters, mailOutLetters, getLetterById, updateLetterById, notarizeLetter, createMailContacts } from '../controllers/LettersController.js';

const router = express.Router();

router.get('/', getLetters);
router.post('/', createLetters);
router.get("/download-all/:userId", downloadAllLetters);
router.get("/mail-out/:userId", mailOutLetters);
router.get("/create-contact", createMailContacts);
router.get("/:letterId", getLetterById);
router.put("/:letterId", updateLetterById);
router.post("/:letterId/notarize", notarizeLetter);


// Add more routes as needed

export default router;
