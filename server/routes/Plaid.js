import express from 'express';
import {
  getPlaid,
  createPlaid,
  exchangeToken,
  fetchCreditDetails,
} from "../controllers/PlaidController.js";

const router = express.Router();

router.get('/plaid', getPlaid);
router.post("/create_link_token", createPlaid);
router.post("/exchange_public_token", exchangeToken);
router.post("/fetch_credit_details", fetchCreditDetails);

// Add more routes as needed

export default router;
