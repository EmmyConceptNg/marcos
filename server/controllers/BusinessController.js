import Business from '../models/Business.js';

// Business controller
export const getBusiness = async (req, res) => {
  // Handle GET request for Business
  try {
    const items = await Business.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBusiness = async (req, res) => {
  // Handle POST request to create Business
  try {
    const newItem = new Business(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add more controller methods as needed
