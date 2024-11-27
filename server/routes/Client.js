import express from 'express';
import { getClient, createClient } from '../controllers/ClientController.js';

const router = express.Router();

router.get('/:userId', getClient);
router.post('/:userId', createClient);

// Add more routes as needed

export default router;
