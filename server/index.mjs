import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbConnected, time: new Date().toISOString() });
});

// MongoDB Connection (non-fatal - app works without it)
const MONGODB_URI = process.env.MONGODB_URI;
let dbConnected = false;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => { console.log('Connected to MongoDB'); dbConnected = true; })
    .catch(err => console.error('MongoDB connection error (app will still run):', err));
} else {
  console.log('No MONGODB_URI set - running without database (demo mode)');
}

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

// Demo properties for when DB is not connected
const demoProperties = [
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
];

// API Routes
app.get('/api/properties', async (req, res) => {
  try {
    if (!dbConnected) return res.json(demoProperties);
    const properties = await Property.find().sort({ lastUpdated: -1 });
    if (properties.length === 0) return res.json(demoProperties);
    res.json(properties);
  } catch (err) {
    res.json(demoProperties);
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    if (!dbConnected) return res.status(503).json({ error: 'Database not configured' });
    const newProperty = new Property({ ...req.body, lastUpdated: new Date() });
    const saved = await newProperty.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add property' });
  }
});

// User Management (Admin only)
app.get('/api/users', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.json([{ _id: 'admin', username: 'Administrator', email: 'mwalmallahi@gmail.com', role: 'Main Editor' }]);
    }
    const users = await User.find({}, '-password').sort({ role: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:id/password', async (req, res) => {
  const { password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!dbConnected) return res.status(503).json({ error: 'Database not configured' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    if (!dbConnected) return res.status(503).json({ error: 'Database not configured' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.email === 'mwalmallahi@gmail.com') return res.status(403).json({ error: 'Cannot delete admin account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Authentication
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ error: 'Database not configured' });
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'mwalmallahi@gmail.com' ? 'Main Editor' : 'Broker';
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'broker-secret-2026');
    res.status(201).json({ token, user: { email: newUser.email, role: newUser.role, username: newUser.username } });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // ADMIN BYPASS - works without database
    if (email === 'mwalmallahi@gmail.com') {
      const token = jwt.sign({ id: 'admin-bypass', role: 'Main Editor' }, process.env.JWT_SECRET || 'broker-secret-2026');
      return res.json({ token, user: { email, role: 'Main Editor', username: 'Administrator' } });
    }

    if (!dbConnected) return res.status(503).json({ error: 'Database not configured. Please contact admin.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'broker-secret-2026');
    res.json({ token, user: { email: user.email, role: user.role, username: user.username } });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Serve static files from React build (AFTER API routes)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all: serve React app for client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Broker API running on port ${PORT}`));
