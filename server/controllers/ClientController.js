import Client from "../models/Client.js";

// Client controller
export const getClient = async (req, res) => {
  // Handle GET request for Client
  try {
    const clients = await Client.find({ createdBy: req.params.userId });
    res.json({clients});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClient = async (req, res) => {
  // Handle POST request to create Client
  try {
    const newItem = new Client(req.body);

    newItem.createdBy = req.params.userId;
    const savedItem = await newItem.save();
    res.status(201).json({client: savedItem, message : 'Client Added Successfully'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add more controller methods as needed
