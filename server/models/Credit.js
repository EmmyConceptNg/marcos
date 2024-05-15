import mongoose from 'mongoose';

const CreditSchema = new mongoose.Schema({
  // Define schema fields
},{timestamps : true});

const Credit = mongoose.model('Credit', CreditSchema);

export default Credit;
