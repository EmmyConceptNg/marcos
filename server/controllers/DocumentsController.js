import Documents from '../models/Documents.js';

// Documents controller
export const getDocuments = async (req, res) => {
  // Handle GET request for Documents
  try {
    const items = await Documents.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDocuments = async (req, res) => {
  // Handle POST request to create Documents
  try {
    const newItem = new Documents(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add more controller methods as needed
