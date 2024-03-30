import express from 'express';
import {
  getSubscription,
  createSubscription,
  initializeSubscription,
  createSubscriptionPlan,
  getSubscriptionPlans,
} from "../controllers/SubscriptionController.js";

const router = express.Router();

router.get('/', getSubscription);
router.post('/', createSubscription);
router.post('/initialize', initializeSubscription);
router.post("/create-plan", createSubscriptionPlan);
router.get("/get-plans", getSubscriptionPlans);

// Add more routes as needed

export default router;
