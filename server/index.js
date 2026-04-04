const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brokerApp';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
  editorId: mongoose.Schema.Types.ObjectId,
  use: String,
  purpose: String,
  price: String,
  ownerName: String,
  isShareable: { type: Boolean, default: true }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Main Editor', 'Broker'], default: 'Broker' }
});

const Property = mongoose.model('Property', PropertySchema);
const User = mongoose.model('User', UserSchema);

// API Routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ lastUpdated: -1 });
    if (properties.length === 0) {
      // Return dummy data if DB is empty for initial demo
      return res.json([
        {
          _id: "1",
          name: 'Skyline Residences',
          type: 'Luxury Residential',
          area: '1,450',
          location: 'Dubai Marina, UAE',
          unitType: '2BHK Apartment',
          availability: 'Available',
          lastUpdated: new Date(),
          sourcePhone: '+971 50 123 4567',
          photoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
          mapLink: 'https://www.google.com/maps/place/Dubai+Marina',
          use: 'Residential',
          purpose: 'Rent',
          price: '120,000',
          ownerName: 'Mr. Saeed Al Falasi',
          isShareable: true
        }
      ]);
    }
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      lastUpdated: new Date()
    });
    const saved = await newProperty.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add property' });
  }
});

// Authentication logic
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // If it's the specific admin email, make them Main Editor
    const role = email === 'mwalmallahi@gmail.com' ? 'Main Editor' : 'Broker';
    
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || "SECRET_KEY");
    
    res.status(201).json({ 
      token, 
      user: { email: newUser.email, role: newUser.role, username: newUser.username } 
    });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "SECRET_KEY");
    res.json({ 
      token, 
      user: { 
        email: user.email, 
        role: user.role,
        username: user.username
      } 
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// For any other request, send back the index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Broker API running on port ${PORT}`));

