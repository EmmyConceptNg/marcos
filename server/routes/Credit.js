import express from 'express';
import { getCredit, createCredit, initializeCredit, addUserCredit } from '../controllers/CreditController.js';

const router = express.Router();

router.get('/', getCredit);
router.post('/', createCredit);
router.post("/initialize", initializeCredit);
router.post("/add-credit", addUserCredit);

// Add more routes as needed

export default router;
