import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // Define schema fields
});

const Business = mongoose.model('Business', schema);

export default Business;
