import express from 'express';
import { getPlan, createPlan } from '../controllers/PlanController.js';

const router = express.Router();

router.get('/plan', getPlan);
router.post('/plan', createPlan);

// Add more routes as needed

export default router;
