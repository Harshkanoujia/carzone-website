require('dotenv').config();
const path = require('path');
const express = require('express');
const { Admin, Customer } = require('./mongodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});



// Admin Signup
app.post('/admin/signup', async (req, res) => {
  try {
    const { name, dob, phoneNo, email, password } = req.body;

    // Validate all required fields are present
    if (!name || !dob || !phoneNo || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send('Admin with this email already exists');
    }

    // Create and save the new admin
    const newAdmin = new Admin({ name, dob, phoneNo, email, password });
    await newAdmin.save();
    res.status(201).send('Admin account created successfully');
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).send('Internal server error');
  }
});

// Admin Signin
app.post('/admin/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    // Find admin by email and password
    const admin = await Admin.findOne({ email, password });

    if (admin) {
      res.send('Admin logged in successfully');
    } else {
      res.status(400).send('Invalid admin credentials');
    }
  } catch (err) {
    console.error('Admin Signin Error:', err);
    res.status(500).send('Error logging in admin');
  }
});


// Customer Signup
app.post('/customer/signup1', async (req, res) => {
  try {
    const { name, dob, phoneNo, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !dob || !phoneNo || !email || !password || !confirmPassword) {
      return res.status(400).send('All fields are required');
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }
    
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).send('Customer with this email already exists');
    }

    // Create and save the customer
    const newCustomer = new Customer({ name, dob, phoneNo, email, password });
    await newCustomer.save();
    res.status(201).send('Customer account created successfully');
  } catch (err) {
    console.error('Customer Signup Error:', err);
    res.status(500).send('Error creating customer account');
  }
});

// Customer Signin
app.post('/customer/signin1', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    // Find the customer
    const customer = await Customer.findOne({ email, password });
    if (customer) {
      res.send('Customer logged in successfully');
    } else {
      res.status(400).send('Invalid customer credentials');
    }
  } catch (err) {
    console.error('Customer Signin Error:', err);
    res.status(500).send('Error logging in customer');
  }
});



// Catch-all route to handle SPA routing
app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/html', '../home.html'));
    res.status(404).send({ statusCode: 404, message: "Failure", Error: "Route Not found" });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
