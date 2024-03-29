import mongoose from 'mongoose';

const PlaidSchema = new mongoose.Schema({
  // Define schema fields
},{timestamps : true});

const Plaid = mongoose.model('Plaid', PlaidSchema);

export default Plaid;
