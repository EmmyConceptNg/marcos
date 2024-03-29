import Plan from '../models/Plan.js';

// Plan controller
export const getPlan = async (req, res) => {
  // Handle GET request for Plan
  try {
    const items = await Plan.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlan = async (req, res) => {
  // Handle POST request to create Plan
  try {
    const newItem = new Plan(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add more controller methods as needed
