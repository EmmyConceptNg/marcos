import express from 'express';
import { getDocuments, createDocuments } from '../controllers/DocumentsController.js';

const router = express.Router();

router.get('/documents', getDocuments);
router.post('/documents', createDocuments);

// Add more routes as needed

export default router;
