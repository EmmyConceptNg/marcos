import Plaid from "../models/Plaid.js";
import User from "../models/User.js";
import axios from "axios";

// Plaid controller
export const getPlaid = async (req, res) => {
  // Handle GET request for Plaid
  try {
    const items = await Plaid.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlaid = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    let data = {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      client_name: user.fullName,
      country_codes: ["US"],
      language: "en",
      user: {
        client_user_id: userId.toString(),
      },
      products: ["auth"],
    };

    // Ensure you are using the correct endpoint for creating link tokens
    const endpoint = "https://sandbox.plaid.com/link/token/create";

    const plaidResponse = await axios.post(endpoint, data, { headers });

    return res.status(200).json(plaidResponse.data);
  } catch (error) {
    console.error("Error during Plaid link token creation: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const exchangeToken = async (req, res) => {
const { userId, publicToken } = req.body;

try {
  const headers = {
    "Content-Type": "application/json",
  };

  let data = {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    public_token: publicToken,
  };

  // Ensure you are using the correct endpoint for creating link tokens
  const endpoint = "https://sandbox.plaid.com//item/public_token/exchange";

  const plaidResponse = await axios.post(endpoint, data, { headers })
const accessToken = plaidResponse.data.access_token;
const itemId = plaidResponse.data.item_id;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      plaidAccessToken: accessToken, 
      plaidItemId: itemId,
    },
    { new: true, lean: true }
  );

  return res.status(200).json({plaid:plaidResponse.data, user});
} catch (error) {
  console.error("Error during Plaid token exchange: ", error);
  res.status(500).json({ error: error.message });
}
};
export const fetchCreditDetails = async (req, res) => {
  const { accessToken } = req.body;

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    let data = {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      public_token: publicToken,
    };

    // Ensure you are using the correct endpoint for creating link tokens
    const endpoint = "https://sandbox.plaid.com//item/public_token/exchange";

    const plaidResponse = await axios.post(endpoint, data, { headers });
    const accessToken = plaidResponse.data.access_token;
    const itemId = plaidResponse.data.item_id;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        plaidAccessToken: accessToken,
        plaidItemId: itemId,
      },
      { new: true, lean: true }
    );

    return res.status(200).json({ plaid: plaidResponse.data, user });
  } catch (error) {
    console.error("Error during Plaid token exchange: ", error);
    res.status(500).json({ error: error.message });
  }
};
