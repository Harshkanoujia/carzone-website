require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('debug', true);


// Connect to MongoDB
mongoose.connect( process.env.MONGO_URI ).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const Admin = mongoose.model('Admin', adminSchema);
const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Admin, Customer };
