import Record from '../models/Record.js';

// Record controller
export const getRecord = async (req, res) => {
  // Handle GET request for Record
  try {
    const items = await Record.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecord = async (req, res) => {
  // Handle POST request to create Record
  try {
    const newItem = new Record(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadRecord = async(req, res) => {
   try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const newCreditRecord = new Record({
      userId: req.params.userId, 
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      filePath: req.file.path,
    });
    
    await newCreditRecord.save();
   
    res.status(201).json({
      success: 'File uploaded and record created successfully',
      creditRecord: newCreditRecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error while processing the upload',
      error: error.message
    });
  }
};
