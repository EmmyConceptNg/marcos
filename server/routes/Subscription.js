import express from 'express';
import {
  getSubscription,
  createSubscription,
  initializeSubscription,
  createSubscriptionPlan,
} from "../controllers/SubscriptionController.js";

const router = express.Router();

router.get('/', getSubscription);
router.post('/', createSubscription);
router.post('/initialize', initializeSubscription);
router.post("/create-plan", createSubscriptionPlan);

// Add more routes as needed

export default router;
