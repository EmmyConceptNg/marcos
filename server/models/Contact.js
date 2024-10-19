import mongoose from "mongoose";


const contactSchema = mongoose.Schema({
  id: String,
  object: String,
  live: Boolean,
  addressLine1: String,
  addressLine2: String,
  addressStatus: String,
  city: String,
  companyName: String,
  country: String,
  countryCode: String,
  description: String,
  email: String,
  firstName: String,
  jobTitle: String,
  lastName: String,
  metadata: {
    friend: String,
  },
  phoneNumber: String,
  postalOrZip: String,
  provinceOrState: String,
},{timestamps : true});


const Contact = mongoose.model('Contact', contactSchema)

export default Contact