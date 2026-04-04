const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brokerApp')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const PropertySchema = new mongoose.Schema({
  name: String,
  type: String,
  area: String,
  location: String,
  unitType: String,
  availability: { type: String, enum: ['Available', 'Rented'], default: 'Available' },
  lastUpdated: { type: Date, default: Date.now },
  sourcePhone: String,
  photoUrl: String,
  mapLink: String,
  editorId: mongoose.Schema.Types.ObjectId
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Main Editor', 'Broker'], default: 'Broker' }
});

const Property = mongoose.model('Property', PropertySchema);
const User = mongoose.model('User', UserSchema);

// Dummy Initial Data Logic
app.get('/api/properties', async (req, res) => {
  // In real app, fetch from DB
  const dummyData = [
    {
      id: "1",
      name: 'Skyline Residences',
      type: 'Luxury Residential',
      area: '1,450',
      location: 'Dubai Marina, UAE',
      unitType: '2BHK Apartment',
      availability: 'Available',
      lastUpdated: new Date().toLocaleDateString(),
      sourcePhone: '+971 50 123 4567',
      photoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
      mapLink: 'https://www.google.com/maps/place/Dubai+Marina'
    }
  ];
  res.json(dummyData);
});

// Authentication logic
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // In real app:
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = new User({ username, email, password: hashedPassword });
    // await newUser.save();
    console.log('User registered:', username, email);
    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Real implementation: 
  // const user = await User.findOne({ email });
  // if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: "demo-id", role: "Main Editor" }, "SECRET_KEY");
  res.json({ token, user: { email, role: "Main Editor" } });
});

// Email Reset Logic (Mockup)
app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body;
  // NodeMailer logic would go here
  res.json({ message: `Reset link sent to ${email}` });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Broker API running on port ${PORT}`));
