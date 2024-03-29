import express from 'express';
import { getBusiness, createBusiness } from '../controllers/BusinessController.js';

const router = express.Router();

router.get('/business', getBusiness);
router.post('/business', createBusiness);

// Add more routes as needed

export default router;
